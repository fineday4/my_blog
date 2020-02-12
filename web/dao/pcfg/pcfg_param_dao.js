/*
 * @Author: xuhuanhuan(hhxu@robvision.cn) 
 * @Date: 2019-12-31 16:17:33 
 * @Last Modified by: xuhuanhuan(hhxu@robvision.cn)
 * @Last Modified time: 2020-01-16 17:04:51
 */

const db_manager = require('../../../lib/db_manager');

class PcfgParamDao
{
    constructor(){
        this.TABLE_NAME = "pcfg_parameter";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE pcfg_parameter(
                    id               INTEGER   PRIMARY KEY  AUTOINCREMENT,
                    name             TEXT      NOT NULL,
                    type             TEXT      NOT NULL,
                    value            TEXT      NOT NULL,
                    sub_id           TEXT      NOT NULL,
                    description      TEXT      NOT NULL,
                    privilege        INTEGER   NOT NULL DEFAULT 7
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
    
    insert(param, res){  
        db_manager.runSqlCmd(`INSERT INTO pcfg_parameter (name, type, value, sub_id, description, privilege) VALUES (?, ?, ?, ?, ?, ?)`, [param.name, param.type,param.value,param.sub_id,param.description,param.privilege], function(err){
            if(err){
                res.json({success: false, message: "添加失败!!"});
            }else{
                res.json({success: true, message: "添加成功!!"});
            }
        });
    }
    
    update(param, ret_cb){
        let str = "UPDATE pcfg_parameter SET name=\'" + param.name +"\', type=\'"+ param.type +"\', value=\'" + param.value + "\', description=\'" + param.description + "\',privilege =\'" + param.privilege + "\' WHERE id =\'"+ param.id + "\'";//TODO:
        console.log("str: ", str);
        db_manager.runSqlCmd(str, function(err){
            ret_cb(err);
        });   
    }

    getOne(id, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM pcfg_parameter WHERE id = ?`, [id] ,ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM pcfg_parameter`, ret_cb);
    }

    getBySubid(sub_id, ret_cb){
        db_manager.queryAllbyConCmd(`SELECT * FROM pcfg_parameter WHERE sub_id = ?`, [sub_id] ,ret_cb);
    }

    delete(id, ret_cb){
        db_manager.runSqlCmd("DELETE FROM pcfg_parameter WHERE id = \'" + id + "\'","",ret_cb);
    }
}


module.exports = new PcfgParamDao();