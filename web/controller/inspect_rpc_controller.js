let express = require('express');
let router = express.Router();
let ipc_manager = require("../../lib/ipc_manager");

let rel_robtype_insitem_dao = require('../dao/rel_robtype_insitem_dao');
let inspect_item_dao = require("../dao/inspect_item_dao");
let inspect_module_dao = require("../dao/inspect_module_dao");
let autotask_exccode_dao = require("../dao/autotask_exccode_dao");
const BN = require('bn.js');
const redis = require('redis');

//task_Cmd enum
const eSubtaskCmd = {"INSPECT_TEST":1700};
const eSubtaskID = {"INSPECT_TEST_ID":-10};
const eTaskStatus = {"SUCESS":0, "RESET":-1, "SUCESS":1};

let auto_test_info;


// 
ipc_manager.subscribe("/mb_taskstatuses", (msg)=>{
    console.log("检测一键检测的状态");
    let statu_data;
    console.log(" Recv task status");
    for(let i = 0;i < msg.statuses.length;i++){
        statu_data = msg.statuses[i];
        let info = {};
        if(statu_data.exc_code == 0){
            info = {"result":"正常", "id":auto_test_info.id, "name": auto_test_info.name}
            resetResult(info);
        }else{
            autotask_exccode_dao.getOne(statu_data.exc_code, (err, row)=>{
                if(err){
                    console.log(" err : ", err);
                }else{
                    console.log(" row :", row);
                    info = {"result":row.desc, "id":auto_test_info.id, "name": auto_test_info.name}
                    resetResult(info);
                }
            });
        }
        console.log(" 一键检测任务结束 状态码为： ", statu_data.exc_code);
    } 
});


//根据机器人类型获取对应检测的模块
router.get("/get_list/:rob_type", (req, res)=>{
    let info = req.params;
    console.log("000 info: ", info);

    rel_robtype_insitem_dao.getSel(info.rob_type, (err, rows)=>{
        if(err){
            console.log("err: ", err);
        }else{
            console.log("rows: ", rows);

            let item_ary = [];

            let p1 = new Promise((resolve, reject)=>{
                rows.forEach(element => {
                    console.log("element: ", element.insitem_id);
                    inspect_item_dao.getOne({id: element.insitem_id}, (err, one_row)=>{
                        if(err){
                            console.log("err: ", err);
                        }else{
                            inspect_module_dao.getOne({name: one_row.belong_module}, (err, module_row)=>{
                                if(err){
                                    console.log("err: ", err);
                                }else{
                                    one_row.belong_module = module_row;
                                    console.log("module_row: ", module_row);
                                    
                                    item_ary.push(one_row);
                                    if(item_ary.length === rows.length){
                                        // console.log("111 item_ary: ", item_ary);
                                        resolve();
                                    }
                                }
                            });
                            // console.log("000 one_row: ", one_row);
                        }
                    });
                });
            });
                            
            p1.then(()=>{
                console.log("222 item_ary: ", item_ary);
                res.json({success: true, data: item_ary });
            });
        }
    });
});


//任务下发
router.post("/send_task", function(req, res){
    let info = req.body.data;
    console.log(info);
    //链接redis服务器
    let redis_cli = redis.createClient();
    redis_cli.on("error", ()=>{
        console.log("redis err !");
    });

    info.forEach(element=>{
        if(element.name == "auto_test"){
            auto_test_info = element;
            resetResult({"result": "待检测", "id": element.id, "name": element.name});

            //下发任务
            ipc_manager.publish("/mb_onlinetasks", 
                {pri_task_cmd: eSubtaskCmd.INSPECT_TEST, task_id: eSubtaskID.INSPECT_TEST_ID});

        }else{
            resetResult({"result": "待检测", "id": element.id, "name": element.name});
            //非一键检测的项目直接redis中读取数据并更新inspect_item表格中的对应的状态值
            redis_cli.on("connect", ()=>{
                redis_cli.hget("inspect_status", element.name, (err, replies)=>{
                    if(err){
                        console.log("hkeys err !");
                        res.send({'success' : 'false'});
                    }else{
                        resetResult({"result": replies, "id": element.id, "name": element.name});
                    }
                });
            });
        }
    });
    res.send({'success' : 'true'});
});


router.get("/get_status", function(req, res){
    let info = req.body.data;
    console.log(" 查询结果的 ID :", info);
    let result_data = [];
    info.forEach((element, index)=>{
        inspect_item_dao.getOne({id: element}, (err, one_row)=>{
            if(err){
                console.log("err: ", err);
            }else{
                console.log(" 遍历查询的状态值：", one_row)
                result_data.push(one_row);
                if(index === info.length - 1){
                    res.json({success: true, data: result_data });
                }
            }
        });
    });
});


function resetResult(info){
    inspect_item_dao.update_result(info, (err, row)=>{
        if(err){
            console.log(" err: ", err);
        }else{
            console.log(" reset result state is sucess >> info :  ", info);
        }
    });
};


module.exports = router;