/*
 * @Author: xuhuanhuan(hhxu@robvision.cn) 
 * @Date: 2019-12-31 16:23:09 
 * @Last Modified by: xuhuanhuan(hhxu@robvision.cn)
 * @Last Modified time: 2020-02-10 14:59:58
 */

const param = require("../../dao/pcfg/pcfg_param_dao");
const user = require('../../dao/users_dao');
const express = require("express");
const router = express.Router();


router.post("", function(req, res){  //ok
    user.getOne(req.body.user,(err, user_info)=>{
        if(err){
            res.json({success: false, message: "服务器出错！！"});
        }else{
            if(user_info){
                if(user_info.auth == 7){
                    param.insert(req.body, res, function(err){
                        if(err){
                            console.log("修改失败!");
                        }else{
                            console.log("param add success");
                        }
                    });
                }else{
                    res.json({success: false, message: "用户没有权限修改"});
                }
            }else{
                res.json({success: false, message: "没有该用户"});
            }
        }
    });

});

router.get("/detail", function(req, res){
    param.get(req.query, (err, ary_detail)=>{
        //req.query必须含有robot的name才可以.
    });
});

router.get("", function(req, res){
    param.getAll((err, ary_param)=>{
        res.json({success: true, data: ary_param});
    });
});

router.get("/:sub_id", function(req, res){ //ok
    param.getBySubid(req.params.sub_id, (err, ary_param)=>{//TODO:
        if(err){
            console.log("err: ", err);
            res.json({success: false});
        }else{
            console.log(" rows: ", ary_param);
            res.json({success: true, data: ary_param});
        }
    });
});

router.put("/:user/:id/:name/:value/:type/:description/:privilege", function(req, res){  //ok 
    user.getOne(req.params.user, (err, user_info)=>{
        if(err){
            res.json({success: false, message: "服务器出错"});
        }else{
            if(user_info){
                param.getOne(req.params.id, (err, param_info)=>{
                    if(err){
                        return res.json({success: false, message: "服务器出错"});
                    }
                    if(param_info.privilege%user_info.auth == 0){
                        param.update(req.params,(err)=>{
                            if(err){
                                console.log("param update false");
                                res.json({success: false, message: "更新失败!!"});
                            }else{
                                res.json({success: true, message: "更新成功!!"});
                                console.log("param update success");
                            }
                        });
                    }else{
                        res.json({success: false, message: "没有权限修改此项"});
                    }
                })
            }else{
                res.json({success: false, message: "用户信息错误，非法操作!!"});
            }
        }
    })
});

//删除一个具体参数
router.delete("/:user/:id", function(req, res){
    user.getOne(req.params.user,(err, user_info)=>{
        if(err){
            res.json({success: false, message: "服务器出错！！"});
        }else{
            if(user_info){
                param.delete(req.params.id,function(err){
                    if(err){
                        res.json({success: false, message: "删除失败"});
                    }else{
                        res.json({success: true, message: "删除成功"});
                    }
                });
            }else{
                res.json({success: false, message: "删除失败"});
            }
        }
    });
});


module.exports = router;