const user = require('../../dao/users_dao');
const robot = require('../../dao/pcfg/pcfg_robot_dao');
const global = require('../../dao/global_dao');
const rob2submod = require('../../dao/pcfg/rel_rob2submod_dao');
const sub = require('../../dao/pcfg/pcfg_submodule_dao');
const async = require('async');
const _ = require('loadsh');
let express = require("express");

let router = express.Router();

router.post("/login", function(req, res){
    user.getOne(req.body.name, (err, user_info)=>{
        if(err){
            console.log("err: ", err);
            res.json({success: false, message: "服务器出错!!"});
        }else{
            if(user_info){
                if(user_info.passwd == req.body.passwd){
                    console.log("user_info: ", user_info);
                    global.getVal('robot', (err, cur_robot)=>{
                        if(err){
                            console.log("err: ", err);
                            res.json({success: false, message: "服务出错！"});
                        }else{
                            if(cur_robot){   //OK
                                console.log("cur_robot.value: ", cur_robot.value);
                                let value = {
                                    user_auth: user_info.auth,
                                    robot: cur_robot.value
                                };
                                req.session.regenerate(function(err){
                                    if(err){
                                        return res.json({success: false, message: "服务出错！"});            
                                    }
                                    req.session.loginUser = user_info.name;
                                    res.json({success: true, message: "登录成功", data: value});//TODO:                         
                                });
                            }else{
                                res.json({success: true, message: -1});
                            }
                        }
                    })
                }else{
                    res.json({success: false, message: "登录密码错误"});
                }
            //    res.json({success: true,  data: user_info});
            console.log("success");
            }else{
                console.log("err: ", err);
               res.json({success: false,  message: "没有该用户"});
            }
        }
})
});

router.get("/get_rob_list", function(req, res){
    console.log("ASDASDSAD");
    robot.getAll((err, ary_robot)=>{
        if(err){
            console.log("err: ", err);
            res.json({success: false});
        }else{
            console.log(" rows: ", ary_robot);
            res.json({success: true, message: "获取成功", data: ary_robot});
        }
    });
});

router.post("/select_robot/:rob_name", function(req, res){
    console.log("user: ", req.body.user);
    user.getOne(req.body.user, (err, user_info)=>{
        if(err){
            res.json({success: false, message: "用户获取失败"});
        }else{
            console.log("user_info: ", user_info);
            if(user_info){
                if(user_info.auth == 7){
                    robot.getOne(req.params.rob_name, (err, robot_info)=>{
                        if(err){
                            res.json({success: false, message: "robot表无数据"});
                        }else{
                            let cur_robot = {
                                "key": "robot",
                                "description": robot_info.description,
                                "value": robot_info.name,
                                "type": "string"
                            };
                            global.insert(cur_robot, (err, ret_info)=>{//TODO:
                                if(err){
                                    console.log("添加失败!");
                                    return res.json({success: false, message: "添加失败!!", data: -1});
                                }else{
                                    console.log("global add success");
                                    return res.json({success: true, message: "添加成功!!", data: ret_info});
                                }
                            });
                        }
                    });
                }else{
                    return res.json({success: false, message: "没有权限"});
                }
            }else{
                return res.json({success: false, message: "没有找到该用户"});
            }
        }
    });
});

router.put("/mod_robot/:user/:value/:description", function(req, res){
    let value = {
        key: "robot",
        value: req.params.value,
        type: "string",
        description: req.params.description,
        old_key: "robot"
    };
    //TODO:
    user.getOne(req.params.user, (err, user_info)=>{
        if(err){
            res.json({success: false, message: "用户获取失败"});
        }else{
            console.log("user_info: ", user_info);
            if(user_info){
                global.update(value, (err)=>{
                    if(err){
                        res.json({success: false, message: "更新失败!!", data: -1});
                    }else{
                        res.json({success: true, message: "更新成功!!", data: value.key});
                    }
                });
            }else{
                res.json({success: false, message: "没有权限", data: -1});
            }
        }
    });
});

router.get("/get_param_list/:robot_name", function(req, res){
    let resut = {};
    console.log("req.params.robot_name:::: ", req.params.robot_name);
    robot.getOne(req.params.robot_name, (err, robot_info)=>{
        if(err){
            console.log("err: ", err);
            res.json({success: false, message: "服务出错！"});
        }else{
            if(robot_info){   //OK
                console.log("robot_info.value: ", robot_info);
                rob2submod.getFromRobot(robot_info.name, (err, ary_mod)=>{
                    if(err){
                        console.log("失败!!");
                        res.json({success: false, message: "模块参数获取失败"});
                    }else{
                        console.log("ary_mod: ",ary_mod.length);
                        async.map(ary_mod, function(item, ret_cb){
                            console.log("item.sub_id: ", item.sub_id);
                            sub.getOne(item.sub_id, (err, ary_result )=>{
                                if(err){
                                    res.json({success: false, message: "服务出错!!"});
                                }else{
                                    resut = {
                                        submodule: ary_result
                                    };    
                                }
                                ret_cb(null, resut);
                            });
                        },function(err, result){
                            // result先排序再提取。
                            let ret = _.sortBy(result, function(o) { return o.submodule.module; });
                            if(err){
                                res.json({success: false, message: "获取结果失败!!"});
                            }else{
                                let arr1 = [];
                                let old_modu = "";
                                let old_descri = "";
                                let arr2 = [];
                                //>>>>>>>>>>>>>>>>>>>>>>BUG<<<<<<<<<<<<<<<<<<<<<<<
                                for(let item1 in ret){
                                    if(old_modu == ""){
                                        old_modu = ret[item1].submodule.module;
                                        old_descri = ret[item1].submodule.description;
                                    }
                                    if(old_modu != ret[item1].submodule.module){
                                        console.log("module::::::: ", old_modu);
                                        let cloned = Object.assign([], arr2);
                                        let obj1 = {
                                            module: old_modu,
                                            description: old_descri,
                                            children: cloned
                                        };
                                        arr1.push(obj1);
                                        old_modu = ret[item1].submodule.module;
                                        arr2.length = 0;
                                    }
                                    let obj = {
                                        name: ret[item1].submodule.name,  
                                        description:ret[item1].submodule.description
                                    }
                                    arr2.push(obj);
                                }
                                //>>>>>>>>>>>>>>>>>>>>>>>>>END<<<<<<<<<<<<<<<<<<<<<<
                                let cloned = Object.assign([], arr2);
                                let obj2 = {
                                    module: old_modu,
                                    description: old_descri,
                                    children: cloned
                                };
                                arr1.push(obj2);
                                res.json({success: true, data: arr1});
                            }
                        });
                    }
                })
            }else{
                res.json({success: false,  message: "列表获取失败！！"});
            }
        }
    })
});

module.exports = router;