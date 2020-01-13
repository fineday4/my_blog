const db_manager = require('../lib/db_manager');

class InspectIndexDao
{
    constructor(){
        this.TABLE_NAME = "robot_module_info";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE robot_module_info(\
                        id INTEGER NOT NULL  PRIMARY KEY AUTOINCREMENT,\
                        inspect_module TEXT NOT NULL,\
                        item_name TEXT NOT NULL,\
                        chinese_item_name TEXT NOT NULL,\
                        view_type INTEGER NOT NULL,\
                        result TEXT NOT NULL,\
                        ins_time  DATETIME NOT NULL\
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

    getOne2(id, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM robot_module_info WHERE id = ?`, [id] ,ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM robot_module_info`, ret_cb);
    }

    update(info, ret_cb){
        db_manager.runSqlCmd(`UPDATE robot_module_info SET inspect_module = ? , item_name = ?, chinese_item_name = ?, view_type = ?, result = ?, datetime = ? WHERE id = ?`, [info.inspect_module, info.item_name, info.chinese_item_name, info.view_type, info.result, info.datetime], ret_cb);
    }

    //重置状态码为
    update_result(info, ret_cb){
        db_manager.runSqlCmd(`UPDATE robot_module_info SET result = ?, datetime = datetime('now', 'localtime') WHERE inspect_module = ? and item_name = ?`, [info.result, info.inspect_module, info.item_name], ret_cb);
    }

    // update_result(info, ret_cb){
    //     db_manager.runSqlCmd(`UPDATE robot_module_info SET result = ?, hos_time = ? WHERE inspect_module = ? and chinese_item_name = ?`, [info.result, info.hos_time, info.inspect_module, info.chinese_item_name], ret_cb);
    // }

    delete(id, ret_cb){
        db_manager.runSqlCmd(`DELETE FROM robot_module_info WHERE id = ?`, [id], ret_cb);
    }
}

module.exports = new InspectIndexDao();