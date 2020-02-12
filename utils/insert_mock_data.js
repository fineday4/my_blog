
let global_dao = require('../web/dao/global_dao');
let rob_type_dao = require('../web/dao/rob_type_dao');
let inspect_module_dao = require('../web/dao/inspect_module_dao');
let inspect_item_dao = require('../web/dao/inspect_item_dao');
let rel_robtype_insitem_dao = require('../web/dao/rel_robtype_insitem_dao');


setTimeout(()=>{

    /// global
    global_dao.updateVal("rob_type", "fr1511b");

    /// rob_type
    const data_robtype = [
        {name: "fr1511a", description: "顶升车"},
        {name: "fr1511c", description: "辊筒车"}
    ];

    for(let one_item of data_robtype){
        console.log("one_item: ", one_item);
        console.log("one_item.name: ", one_item.name,);
        console.log("one_item.description: ", one_item.description);

        rob_type_dao.insertIfNotExist(one_item, (err, data)=>{
            if(err){
                console.log("insertion failed !");
            }
        });
    }


    /// inspect module    
    const data_inspect_module = [
        {name: "base", description: "底座模块"},
        {name: "roller", description: "辊筒模块"},
        {name: "laser", description: "激光模块"}
    ];

    for(let one_item of data_inspect_module){
        // console.log("one_item: ", one_item);

        inspect_module_dao.insertIfNotExist(one_item, (err, data)=>{
            if(err){
                console.log("insertion failed !");
            }
        });
    }


    /// inspect item
    const data_inspect_item = [
        {id: 10, name: "sensor", description: "位置光电传感器", type: 3, result: 0, belong_module: "base"},
        {name: "emerg", description: "底座急停", type: 3, result: 0,  belong_module: "base"},
        {name: "bump", description: "底座碰撞条", type: 3, result: 0,  belong_module: "base"},

        {name: "bump", description: "辊筒碰撞条", type: 3, result: 0, belong_module: "roller"},
        {name: "emerg", description: "辊筒急停", type: 3, result: 0, belong_module: "roller"},
        {name: "auto_test", description: "辊筒一键检测", type: 1, result: 0, belong_module: "roller"},

        {name: "laser", description: "主激光", type: 2, result: 2, belong_module: "laser"},
        {name: "back_laser", description: "后激光", type: 2, result: 2, belong_module: "laser"}
    ];
    
    for(let one_item of data_inspect_item){
        // console.log("one_item: ", one_item);

        inspect_item_dao.insertIfNotExist(one_item, (err, data)=>{
            if(err){
                console.log("insertion failed: ", err);
            }
        });
    }
    
    /// rel_robtype_insitem
    const data_rel_robtype_insitem = [
        {rob_type: "fr1511a", insitem_id: "1"},
        {rob_type: "fr1511a", insitem_id: "2"},
        {rob_type: "fr1511a", insitem_id: "3"},
        {rob_type: "fr1511a", insitem_id: "7"},

        {rob_type: "fr1511c", insitem_id: "1"},
        {rob_type: "fr1511c", insitem_id: "2"},
        {rob_type: "fr1511c", insitem_id: "3"},

        {rob_type: "fr1511c", insitem_id: "4"},
        {rob_type: "fr1511c", insitem_id: "5"},
        {rob_type: "fr1511c", insitem_id: "6"},
        {rob_type: "fr1511c", insitem_id: "7"}
    ];

    for(let one_item of data_rel_robtype_insitem){
        // console.log("one_item: ", one_item);

        rel_robtype_insitem_dao.insertIfNotExist(one_item, (err, data)=>{
            if(err){
                console.log("insertion failed: ", err);
            }
        });
    }

    

}, 500);

