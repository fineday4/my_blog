/*
 * @Author: xuhuanhuan(hhxu@robvision.cn) 
 * @Date: 2019-12-31 16:17:33 
 * @Last Modified by: xuhuanhuan(hhxu@robvision.cn)
 * @Last Modified time: 2020-01-16 16:50:03
 */

const db_manager = require('../../../lib/db_manager');

class PcfgSubmoduleDao
{
    constructor(){
        this.TABLE_NAME = "pcfg_submodule";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE pcfg_submodule(
                    name           TEXT      PRIMARY KEY,
                    module         TEXT      NOT NULL,
                    description    TEXT      NOT NULL
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
    
    insert(submod, res){  
        if(submod.auth == 7){
            db_manager.runSqlCmd(`INSERT INTO pcfg_submodule (name, description, module) VALUES (?, ?, ?)`, [submod.name, submod.description, submod.module], function(err){
                if(err){
                    res.json({success: false, message: "添加失败!!"});
                }else{
                    res.json({success: true, message: "添加成功!!"});
                }
            });
        }else{
            res.json({success: false, message: "没有权限!!!"});
        }
    }

    update(submod, res){
        if(submod.auth == 7){
            db_manager.runSqlCmd("UPDATE pcfg_submodule SET (name, description, module) WHERE name=?", [submod.name, submod.description, submod.module, submod.old_name], function(err){
                if(err){
                    res.json({success: false, message: "更新失败!!"});
                }else{
                    res.json({success: true, message: "更新成功!!"});
                }
            });
        }else{
            res.json({success: false, message: "没有权限!!"});
        }
    }

    getOne(name, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM pcfg_submodule WHERE name = ?`, [name] ,ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM pcfg_submodule`, ret_cb);
    }

    getByName(name, ret_cb){
        db_manager.queryAllbyConCmd(`SELECT * FROM pcfg_submodule WHERE name = ?`, [name] ,ret_cb);
    }


    delete(submod, res, ret_cb){
        if(submod.auth == 7){
            db_manager.runSqlCmd("DELETE FROM pcfg_submodule WHERE name = \'" + submod.name + "\'","",ret_cb);
            res.json({success: true, message: "删除成功!!"});
        }else{
            res.json({success: false, message: "删除失败!!"});
        }
    }
}


module.exports = new PcfgSubmoduleDao();