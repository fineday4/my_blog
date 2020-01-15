const db_manager = require('../../lib/db_manager');

class RelRobtypeInsitem
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
                        rob_type  TEXT NOT NULL,\
                        insitem_id TEXT NOT NULL
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
        db_manager.runSqlCmd(`INSERT INTO rel_robtype_insitem (robot, item_module, chinese_name) VALUES (?, ?, ?)`, [info.robot, info.item_module, info.chinese_name], function(err, ret_info, self){
            console.log("ret_info: ", ret_info);
            
            if(err){
                console.log("err: ", err);
            }else{
                self.getOne2(ret_info.inserted_id, ret_cb);
            }
        }, this);
    }

    insertIfNotExist(info, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM rel_robtype_insitem WHERE rob_type = ? AND insitem_id = ?`, [info.rob_type, info.insitem_id], (err, one_item)=>{
            if(err){
                console.log("err: ", err);
            }else{
                if(!one_item){
                    db_manager.runSqlCmd(`INSERT INTO rel_robtype_insitem (rob_type, insitem_id) VALUES (?, ?)`, [info.rob_type, info.insitem_id], ret_cb);
                }
            }
        });
    }

    getSel(rob_type, ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM rel_robtype_insitem WHERE rob_type = ?`, [rob_type], ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM rel_robtype_insitem`, ret_cb);
    }

    update(info, ret_cb){
        db_manager.runSqlCmd(`UPDATE rel_robtype_insitem SET item_module = ? , robot = ?, chinese_name = ? WHERE id = ?`, [info.item_module, info.robot, info.chinese_name, info.id], ret_cb);
    }

    delete(id, ret_cb){
        db_manager.runSqlCmd(`DELETE FROM rel_robtype_insitem WHERE id = ?`, [id], ret_cb);
    }
}


module.exports = new RelRobtypeInsitem();