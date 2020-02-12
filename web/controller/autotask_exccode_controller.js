// let express = require('express');
// let state_code_dao = require('../dao/state_code_dao');
// let router = express.Router();

// router.get("/", function(req, res){
//     let info = req.query; 
//     state_code_dao.getExcCode(info, function(err, data){
//         if(err){
//             console.log("err: ",err);
//             res.send({'success' : 'false'});
//         }else{
//             console.log(" getExcCode  data: ", data);
//             res.json(data);
//         }
//     });
// });

// router.post("/", function(req, res){
//     let info = req.query;
//     state_code_dao.createExcCode(info ,function(err){
//         if(err){
//             console.log("err: ",err);
//             res.send({'success' : 'false'});
//         }else{
//             res.send({'success' : 'true'});
//         }
//     });
// });

// router.put("/", function(req, res){
//     let info = req.query;
//     state_code_dao.modiExcCode(info ,function(err){
//         if(err){
//             console.log("err: ",err);
//             res.send({'success' : 'false'});
//         }else{
//             res.send({'success' : 'true'});
//         }
//     });
// });

// router.delete("/", function(req, res){
//     let info = req.query;
//     state_code_dao.deleteExcCode(info ,function(err){
//         if(err){
//             console.log("err: ",err);
//             res.send({'success' : 'false'});
//         }else{
//             res.send({'success' : 'true'});
//         }
//     });
// });

// module.exports = router;
