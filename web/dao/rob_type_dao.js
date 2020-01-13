const db_manager = require('../lib/db_manager');

class InspectIndexDao
{
    constructor(){
        this.TABLE_NAME = "rob_type";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE rob_type(\
                        name  CHAR(20) NOT NULL PRIMARY KEY,
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
        db_manager.runSqlCmd(`INSERT INTO rob_type VALUES (?, ?)`, [info.name, info.description], function(err, ret_info, self){
            console.log("ret_info: ", ret_info);
            
            if(err){
                console.log("err: ", err);
            }else{
                console.log("ret_info: ", ret_info);
                // self.getOne(ret_info.inserted_id, ret_cb);
            }
        }, this);
    }

    insertIfNotExist(info, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM rob_type WHERE name = ?`, [info.name], (err, one_item)=>{
            if(err){
                console.log("err: ", err);
            }else{
                if(!one_item){
                    db_manager.runSqlCmd(`INSERT INTO rob_type VALUES (?, ?)`, [info.name, info.description], ret_cb);
                }
            }
        });
    }

    getOne(inspect_module, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM rob_type WHERE inspect_module = ?`, [inspect_module] ,ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM rob_type`, ret_cb);
    }
}

module.exports = new InspectIndexDao();