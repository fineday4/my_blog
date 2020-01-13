const db_manager = require('../lib/db_manager');

class InspectIndexDao
{
    constructor(){
        this.TABLE_NAME = "rel_robtype_insitem";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            // console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE rel_robtype_insitem(\
                        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                        robot_type  TEXT NOT NULL,\
                        item_module TEXT NOT NULL,\
                        chinese_name TEXT NOT NULL
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
        db_manager.runSqlCmd(`INSERT INTO index_item_module (robot, item_module, chinese_name) VALUES (?, ?, ?)`, [info.robot, info.item_module, info.chinese_name], function(err, ret_info, self){
            console.log("ret_info: ", ret_info);
            
            if(err){
                console.log("err: ", err);
            }else{
                self.getOne2(ret_info.inserted_id, ret_cb);
            }
        }, this);
    }
    
    getOne(robot, ret_cb){
        console.log(robot);
        db_manager.queryOneSqlCmd(`SELECT * FROM index_item_module WHERE robot = ?`, [robot] ,ret_cb);
    }

    getOne2(id, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM index_item_module WHERE id = ?`, [id] ,ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM index_item_module`, ret_cb);
    }

    update(info, ret_cb){
        db_manager.runSqlCmd(`UPDATE index_item_module SET item_module = ? , robot = ?, chinese_name = ? WHERE id = ?`, [info.item_module, info.robot, info.chinese_name, info.id], ret_cb);
    }

    delete(id, ret_cb){
        db_manager.runSqlCmd(`DELETE FROM index_item_module WHERE id = ?`, [id], ret_cb);
    }
}


module.exports = new InspectIndexDao();