
let global_dao = require('../web/dao/global_dao');
let rob_type_dao = require('../web/dao/rob_type_dao');


setTimeout(()=>{

    // global
    global_dao.getVal("rob_type", (err, data)=>{
        if(err){
            console.log("err: ", err);
    
        }else{
            if(!data){
                global_dao.updateVal("rob_type", "fr1511b");
                console.log("data: ", data);

            }else{
                console.log("data: ", data);
            }
        }
    });

    // rob_type
    const data_robtype = [
        {name: "fr1511a", description: "顶升车"},
        {name: "fr1511c", description: "辊筒车"}
    ];

    for(let one_item of data_robtype){
        console.log("one_item: ", one_item);
        console.log("one_item.name: ", one_item.name,);
        console.log("one_item.description: ", one_item.description);

        rob_type_dao.insertIfNotExist({name: one_item.name, description: one_item.description}, (err, data)=>{
            if(err){
                console.log("insertion failed !");
            }
        });
    }

    // inspect item
    const data_robtype = [
        {name: "fr1511a", description: "顶升车"},
        {name: "fr1511c", description: "辊筒车"}
    ];

    

}, 500);

