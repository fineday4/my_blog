const db_manager = require('../../lib/db_manager');

class InspectItemDao
{
    constructor(){
        this.TABLE_NAME = "inspect_item";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE inspect_item(\
                        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                        name CHAR(20) NOT NULL,\
                        description TEXT NOT NULL,\
                        type INTEGER NOT NULL,\
                        result TEXT NOT NULL,\
                        ins_time  DATETIME,\
                        belong_module CHAR(20) NOT NULL,\
                        FOREIGN KEY(belong_module) REFERENCES inspect_module(name)
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
        db_manager.runSqlCmd(`INSERT INTO inspect_item (inspect_module, item_name, chinese_item_name, view_type, result, datetime) VALUES (?, ?, ?, ?, ?, ?)`, [info.inspect_module, info.item_name, info.chinese_item_name, info.view_type, info.result, info.datetime], function(err, ret_info, self){
            console.log("ret_info: ", ret_info);
            
            if(err){
                console.log("err: ", err);
            }else{
                self.getOne2(ret_info.inserted_id, ret_cb);
            }
        }, this);
    }
    
    // {name: "laser_back", description: "后激光", type: 0, result: 0, belong_module: "laser"}

    insertIfNotExist(info, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM inspect_item WHERE name = ?`, [info.name], (err, one_item)=>{
            if(err){
                console.log("err: ", err);
            }else{
                if(!one_item){
                    db_manager.runSqlCmd(`INSERT INTO inspect_item (name, description, type, result, belong_module) VALUES (?, ?, ?, ?, ?)`,
                                [info.name, info.description, info.type, info.result, info.belong_module], ret_cb);
                }
            }
        });
    }

    getOne(info, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM inspect_item WHERE id = ?`, [info.id] ,ret_cb);
    }

    // getAll(ret_cb){
    //     db_manager.queryAllSqlCmd(`SELECT * FROM inspect_item`, ret_cb);
    // }

    // update(info, ret_cb){
    //     db_manager.runSqlCmd(`UPDATE inspect_item SET inspect_module = ? , item_name = ?, chinese_item_name = ?, view_type = ?, result = ?, datetime = ? WHERE id = ?`, [info.inspect_module, info.item_name, info.chinese_item_name, info.view_type, info.result, info.datetime], ret_cb);
    // }

    //重置状态码为
    update_result(info, ret_cb){
        db_manager.runSqlCmd(`UPDATE inspect_item SET result = ?, ins_time = datetime('now', 'localtime') WHERE id = ? and name = ?`, [info.result, info.id, info.name], ret_cb);
    }

    // delete(id, ret_cb){
    //     db_manager.runSqlCmd(`DELETE FROM inspect_item WHERE id = ?`, [id], ret_cb);
    // }
}


module.exports = new InspectItemDao();