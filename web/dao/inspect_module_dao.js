const db_manager = require('../lib/db_manager');

class InspectIndexDao
{
    constructor(){
        this.TABLE_NAME = "inspect_module";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE inspect_module(\
                        name TEXT NOT NULL,\
                        description TEXT NOT NULL
                    )`
                , (err)=>{
                    if(err){
                        console.log("err: " , err);
                    }else{
                        console.log("table created: " + this.TABLE_NAME);
                    }
                });
            }
        });   
    }

    insert(info, ret_cb){
        db_manager.runSqlCmd(`INSERT INTO robot_module_info (inspect_module, item_name, chinese_item_name, view_type, result, datetime) VALUES (?, ?, ?, ?, ?, ?)`, [info.inspect_module, info.item_name, info.chinese_item_name, info.view_type, info.result, info.datetime], function(err, ret_info, self){
            console.log("ret_info: ", ret_info);
            
            if(err){
                console.log("err: ", err);
            }else{
                self.getOne2(ret_info.inserted_id, ret_cb);
            }
        }, this);
    }
    
    getOne(inspect_module, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM robot_module_info WHERE inspect_module = ?`, [inspect_module] ,ret_cb);
    }

    get_module(inspect_module, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT chinese_item_name, view_type, item_name FROM robot_module_info WHERE inspect_module = ?`, [inspect_module] ,ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM robot_module_info`, ret_cb);
    }
}

module.exports = new InspectIndexDao();