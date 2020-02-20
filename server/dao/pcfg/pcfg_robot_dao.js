/*
 * @Author: xuhuanhuan(hhxu@robvision.cn) 
 * @Date: 2019-12-31 10:14:13 
 * @Last Modified by: xuhuanhuan(hhxu@robvision.cn)
 * @Last Modified time: 2020-01-17 15:01:03
 */

const db_manager = require('../../../lib/db_manager');

class PcfgRobotDao
{
    constructor(){
        this.TABLE_NAME = "pcfg_robot";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE pcfg_robot(
                    name           CHAR(12)  PRIMARY KEY,
                    description    TEXT      NOT NULL
                    )`
                    , (err)=>{
                        if(err){
                            console.log("pcfg_robot err: " , err);
                        }else{
                            console.log("table created: " + this.TABLE_NAME);
                        }
                    });
            }
        });   
    }
    
    insert(rob, res){
        if(rob.auth == 7){
            db_manager.runSqlCmd(`INSERT INTO pcfg_robot (name, description, idx) VALUES (?, ?, ?)`, [rob.name, rob.description, rob.idx], function(err){
                if(err){
                    res.json({success: false, message: "添加失败!!"});
                }else{
                    res.json({success: true, message: "添加成功!!"});
                }
            });
        }else{
            res.json({success: false, message: "没有该权限!!"});
        }
           
    }

    update(rob, res){
        if(rob.auth == 7){
            db_manager.runSqlCmd("UPDATE pcfg_robot SET (name, description) WHERE name =?",[rob.name, rob.description, rob.old_name], function(err){
                if(err){
                    res.json({success: false, message: "更新失败!!"});
                }else{
                    res.json({success: true, message: "更新成功!!"});
                }
            }); 
        }else{
            res.json({success: false, message: "你可没有这个权限!!"});
        }   
    }

    getOne(name, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM pcfg_robot WHERE name = ?`, [name] ,ret_cb);
    }

    getAll(ret_cb){
        console.log("ge ALLL ");
        db_manager.queryAllSqlCmd(`SELECT * FROM pcfg_robot`, ret_cb);
    }

    delete(rob, res, ret_cb){
        if(rob.auth == 7){
            db_manager.runSqlCmd("DELETE FROM pcfg_robot WHERE name = \'" + rob.name + "\'","",ret_cb);
            res.json({success: true, message: "删除成功!!"});
        }else{
            res.json({success: false, message: "没有该权限!!"});
        }
    }
}


module.exports = new PcfgRobotDao();