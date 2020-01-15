let express = require('express');
let router = express.Router();
let run_task = require("../model/Run_task");

let rel_robtype_insitem_dao = require('../dao/rel_robtype_insitem_dao');
let inspect_item_dao = require("../dao/inspect_item_dao");
let inspect_module_dao = require("../dao/inspect_module_dao");

const BN = require('bn.js');

// ros msgs
const _finder = _ros_msg_utils.Find;
let lxind_msgs = _finder('lxind_msgs');

const nav_task = lxind_msgs.msg.NavTask;
const nav_tasks = lxind_msgs.msg.NavTasks;
const task_status = lxind_msgs.msg.TaskStatus;
const task_statuses = lxind_msgs.msg.TaskStatuses; 


//CB
let inspect_test_;

//task_Cmd enum
const eSubtaskCmd = {"INSPECT_TEST":1700};
const eSubtaskID = {"INSPECT_TEST_ID":-10};
const eTaskStatus = {"SUCESS":0, "RESET":-1, "SUCESS":1};

let msg_tasks;
let msg_task;
let m_status;
let m_statuses;

let in_create;


//记录对应的模块具体信息，并且分类存储
let auto_test_ = [];
let manual_detection_ = [];
let send_data_ = [];

//记录选择的模块
let module_select;


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
                res.json({success: true, data: {} });
            });

        }
    });
});


//根据页面选择，传入的索引值显示的模块名称，获取显示的内容
router.get("/:robot/:module_info", (req, res)=>{
    //一键检测的模块信息
    auto_test_ = [];
    //人工检测的模块信息
    manual_detection_ = [];
    //发送的数据
    send_data_ = [];

    let info = req.params; 
        //显示第一个模块的内容
    module_select = module_temp_[info.module_info];
    console.log("module_select: ", module_select);

    // robot_module_dao.get_module(module_select, (err, row)=>{
    //     if(err){
    //         console.log(" err:  ", err);
    //     }else{
    //         console.log(" get_module:  ", row);
    //         for(let i = 0; i < row.length; i++){
    //             if(row[i].view_type === 1 || row[i].view_type ===2){
    //                 auto_test_.push(row[i])
    //             }else if(row[i].view_type === 3){
    //                 manual_detection_.push(row[i]);
    //             }
    //         }
    //         send_data_.push(auto_test_);
    //         send_data_.push(manual_detection_);
    //         console.log("send_data:  ", send_data_);
    //         res.json({success: true, logged_in:req.session.logged_in, data: send_data_});
    //     }
    // });

});

//任务下发
router.get("/task/:robot/:task_info", function(req, res){
    let info = req.params;
    // grpc.getRealTimeData(function(err, inspect_data_){
    //     if(err){
    //         console.log("err: ",err);
    //         res.send({'success' : 'false'});
    //     }else{
    //         console.log(inspect_data_);
    //         if(inspect_data_.is_connect_serial === false){
    //             let err_data = {"data":"串口未能正常连接"};
    //             res.json({success: true, logged_in:req.session.logged_in, data: err_data});
    //         }else{
    //             //正常通信就可以进行质量检测
    //             let temp_data = send_data_[info.task_info];
    //             console.log("test data insert tabble : ", temp_data);

    //             for(let i = 0; i < temp_data.length; i++){
    //                 if(temp_data[i].item_name === "auto_test"){
    //                     //下发一键检测任务 ,首先更新状态码
    //                     inspect_test_.reset_result(eTaskStatus.RESET, "auto_test");
    //                     console.log(" 一键检测任务重置状态码完成 ");
    //                     msg_tasks = new nav_tasks();
    //                     msg_task = new nav_task();
    //                     m_status = new task_status();
    //                     m_statuses = new task_statuses();

    //                     //任务状态监听状态
    //                     console.log("检测一键检测的状态");
    //                     run_task.subTaskStatus("/mb_taskstatuses", task_statuses.datatype(), (msg)=>{
    //                         m_statuses = task_statuses.Resolve(msg);
    //                         let statu_data;
    //                         console.log(" Recv task status");
    //                         for(let i = 0;i < m_statuses.statuses.length;i++){
    //                             statu_data = m_statuses.statuses[i];
    //                             if(statu_data.task_id.toNumber() === eSubtaskID.INSPECT_TEST_ID){
    //                                 let info = {"taskcmd":eSubtaskCmd.INSPECT_TEST, "code":statu_data.exc_code};
    //                                 console.log(info);
    //                                 inspect_test_.reset_result(info.code, "auto_test");
    //                                 console.log(" 一键检测任务结束 状态码为： ", statu_data.exc_code);
    //                             }
    //                         } 
    //                     })
    //                     //任务下发的过程
    //                     msg_task.pri_task_cmd = eSubtaskCmd.INSPECT_TEST;
    //                     msg_task.task_id = eSubtaskID.INSPECT_TEST_ID;
    //                     console.log(msg_task);
    //                     msg_tasks.tasks = [msg_task];
    //                     run_task.pubTask(msg_tasks);
    //                     console.log(" auto task is describ!!  ");
    //                 }else if(temp_data[i].item_name === "laser"){
    //                     inspect_test_.reset_result(inspect_data_.has_scan_data, temp_data[i].item_name);
    //                     console.log(" update resilt : ", inspect_data_.has_scan_data);
    //                 }else if(temp_data[i].item_name === "back_laser"){
    //                     inspect_test_.reset_result(inspect_data_.has_back_scan_data, temp_data[i].item_name);
    //                     console.log(" update resilt : ", inspect_data_.has_back_scan_data);
    //                 }else if(temp_data[i].item_name === "emerg"){
    //                     inspect_test_.reset_result(inspect_data_.is_emerg_pressed, temp_data[i].item_name);
    //                     console.log(" update resilt : ", inspect_data_.is_emerg_pressed);
    //                 }else if(temp_data[i].item_name === "bump"){
    //                     inspect_test_.reset_result(inspect_data_.is_bumped, temp_data[i].item_name);
    //                     console.log(" update resilt : ", inspect_data_.is_bumped);
    //                 }else if(temp_data[i].item_name === "motor"){
    //                     inspect_test_.reset_result(inspect_data_.is_normal_motor, temp_data[i].item_name);
    //                     console.log(" update resilt : ", inspect_data_.is_normal_motor);
    //                 }else if(temp_data[i].item_name === "battle"){
    //                     inspect_test_.reset_result(inspect_data_.is_normal_battle, temp_data[i].item_name);
    //                     console.log(" update resilt : ", inspect_data_.is_normal_battle);
    //                 }else if(temp_data[i].item_name === "sersor"){
    //                     inspect_test_.reset_result(inspect_data_.has_sersor_sig, temp_data[i].item_name);
    //                     console.log(" update resilt : ", inspect_data_.has_sersor_sig);
    //                 }
    //             }
    //             res.json({'success': 'true'}); 
    //         }
    //     }
    // });
});

inspect_test_ = {
    reset_result(task_status, itemname){
        let info = {
            result : task_status,
            inspect_module : module_select,
            item_name : itemname
        }
        // robot_module_dao.update_result(info, (err, row)=>{
        //     if(err){
        //         console.log(" err: ", err);
        //         res.send({'success' : 'false'});
        //     }else{
        //         console.log(" reset result state is sucess ");
        //     }
        // });
    }
}


module.exports = router;