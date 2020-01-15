let express = require('express');
let inspect_module_dao = require('../dao/inspect_module_dao');
let router = express.Router();


router.get("/", function(req, res){
    console.log("/inspect/module !!!!");

    inspect_module_dao.getAll((err, data)=>{
        if(err){
            console.log("err: ",err);
        }else{
            // console.log("data get: data: ", data);
            res.json({success: true, data: data});
        }
    });
});

router.get("/:module", function(req, res){
    let info = req.params; 
    console.log("!!!!!!!!!!!! ", info);

    inspect_module_dao.getOne({name: info.module}, (err, data)=>{
        if(err){
            console.log("err: ",err);
        }else{
            // console.log("22222 data got: ", data);
            res.json({success: true, data: data});
        }
    });
})




router.post("/", function(req, res){
    let info = req.query;
    console.log(info);
    let in_create = {
        inspect_module : info.inspect_module,
        item_name : info.item_name,
        chinese_item_name : info.chinese_item_name,
        view_type : info.view_type,
        result : info.result,
        datetime : info.datetime
    }
    console.log("000", in_create);
    // robot_module_dao.insert(in_create, (err, data)=>{
    //     if(err){
    //         console.log("err: ",err);
    //     }else{
    //         console.log("data post: data: ", data);
    //         res.json({success: true, logged_in:req.session.logged_in, data: data}); 
    //     }
    // });
});

router.put("/:id", function(req, res){
    let info = req.params;
    let in_create = {
        id : info.id,
        inspect_module : info.inspect_module,
        item_name : info.item_name,
        chinese_item_name : info.chinese_item_name,
        view_type : info.view_type,
        result : info.result,
        datetime : info.datetime
    }

    // robot_module_dao.update(in_create, (err)=>{
    //     if(err){
    //         console.log("err: ",err);
    //     }else{
    //         console.log("data update: success: ");
    //         res.json({'success': 'true'}); 
    //     }
    // });
});

router.delete("/:id", function(req, res){
    let info = req.params;
    // robot_module_dao.delete(info.id ,function(err){
    //     if(err){
    //         console.log("err: ",err);
    //         res.send({'success' : 'false'});
    //     }else{
    //         res.send({'success' : 'true'});
    //     }
    // });
});


module.exports = router;