/*
 * @Author: xuhuanhuan(hhxu@robvision.cn) 
 * @Date: 2019-12-31 10:14:13 
 * @Last Modified by: xuhuanhuan(hhxu@robvision.cn)
 * @Last Modified time: 2020-01-16 17:05:04
 */

const db_manager = require('../../../lib/db_manager');

class Pcfgrob2SubModDao
{
    constructor(){
        this.TABLE_NAME = "pcfg_rob2submod_rel";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE pcfg_rob2submod_rel(
                    id        INTEGER   PRIMARY KEY  AUTOINCREMENT,
                    rob_id    TEXT      NOT NULL,
                    sub_id    TEXT      NOT NULL
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
    
    insert(rob2sub, res){
        if(rob2sub.auth == 7){
            db_manager.runSqlCmd(`INSERT INTO pcfg_rob2submod_rel (rob_id, sub_id) VALUES (?, ?)`, [rob2sub.rob_id, rob2sub.sub_id], function(err){
                if(err){
                    res.json({success: false, message: "添加失败!!"});
                }else{
                    res.json({success: true, message: "添加成功!!"});
                }
            });
        }  
    }

    update(rob2sub, res){
        if(rob2sub.auth == 7){
            db_manager.runSqlCmd("UPDATE pcfg_rob2submod_rel SET (rob_id, sub_id)   WHERE id =?",[rob2sub.rob_id, rob2sub.sub_id, rob2sub.id], function(err){
                if(err){
                    res.json({success: false, message: "更新失败!!"});
                }else{
                    res.json({success: true, message: "更新成功!!"});
                }
            }); 
        }else{
            res.json({success: false, message: "更新失败!!"});
        }
    }

    getOne(id, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM pcfg_rob2submod_rel WHERE id = ?`, [id] ,ret_cb);
    }

    getFromRobot(rob_id, ret_cb){
        console.log("getFromRobot-> rob_id: ", rob_id);
        db_manager.queryAllbyConCmd(`SELECT * FROM pcfg_rob2submod_rel WHERE rob_id = ?`, [rob_id] ,ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM pcfg_rob2submod_rel`, ret_cb);
    }

    delete(rob2sub, res, ret_cb){
        if(rob2sub.auth == 7){
            db_manager.runSqlCmd("DELETE FROM pcfg_rob2submod_rel WHERE id = \'" + rob2sub.id + "\'","",ret_cb);
            res.json({success: true, message: "删除成功!!"});
        }else{
            res.json({success: false, message: "删除失败!!"});
        }
    }
}


module.exports = new Pcfgrob2SubModDao();