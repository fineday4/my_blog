let express = require('express');
let inspect_robtype_dao = require('../dao/rel_robtype_insitem_dao');
let router = express.Router();

router.get("/:robot", function(req, res){
    let info = req.params; 
    console.log(info);
    inspect_robtype_dao.getOne(info.robot, (err, data)=>{
        if(err){
            console.log("err: ",err);
        }else{
            console.log("data inserted: data: ", data);
            res.json({success: true, logged_in:req.session.logged_in, data: data});
        }
    });
})


router.get("/", function(req, res){
    inspect_robtype_dao.getAll((err, data)=>{
        if(err){
            console.log("err: ",err);
        }else{
            console.log("data get: data: ", data);
            res.json({success: true, logged_in:req.session.logged_in, data: data});
        }
    })
});

router.post("/", function(req, res){
    let info = req.query;
    console.log(info);
    let in_create = {
        robot : info.robot,
        item_module : info.item_module,
        chinese_name : info.chinese_name
    }
    console.log("000", in_create);
    inspect_robtype_dao.insert(in_create, (err, data)=>{
        if(err){
            console.log("err: ",err);
        }else{
            console.log("data post: data: ", data);
            res.json({success: true, logged_in:req.session.logged_in, data: data}); 
        }
    })
});

router.put("/:id", function(req, res){
    let info = req.params;
    let in_create = {
        id : info.id,
        robot : info.robot,
        item_module : info.item_module,
        chinese_name : info.chinese_name
    }

    inspect_robtype_dao.update(in_create, (err)=>{
        if(err){
            console.log("err: ",err);
        }else{
            console.log("data update: success: ");
            res.json({'success': 'true'}); 
        }
    });
});

router.delete("/:id", function(req, res){
    let info = req.params;
    inspect_robtype_dao.delete(info.id ,function(err){
        if(err){
            console.log("err: ",err);
            res.send({'success' : 'false'});
        }else{
            res.send({'success' : 'true'});
        }
    });
});


module.exports = router;