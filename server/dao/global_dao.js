const db_manager = require('../../lib/db_manager');

class GlobalDao
{
    constructor(){
        this.TABLE_NAME = "global";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            if(!has){
                db_manager.runSqlCmd(
                    `CREATE TABLE global(
                        key            CHAR(20)           NOT NULL    PRIMARY KEY,
                        value          VARCHAR(255)       NOT NULL,
                        description    TEXT               NOT NULL,
                        type           TEXT               NOT NULL
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

    updateVal(name, value, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM global WHERE key = ?`, [name], (err, one_item)=>{
            if(err){
                console.log("err: ", err);
            }else{
                if(one_item){
                    // update
                    db_manager.runSqlCmd(`UPDATE global SET value = ? WHERE key = ?`, [value, name], ret_cb);

                }else{
                    // insert
                    db_manager.runSqlCmd(`INSERT INTO global VALUES (?, ?)`, [name, value], ret_cb);
                }
            }
        });
    }

    getVal(name, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM global WHERE key = ?`, [name] ,ret_cb);
    }

    delVal(name, ret_cb){
        db_manager.queryOneSqlCmd(`DELETE FROM global WHERE key = ?`, [name] ,ret_cb);
    }

    insert(glob, ret_cb){
        db_manager.runSqlCmd(`INSERT INTO global (key, description, value, type) VALUES (?, ?, ?, ?)`, [glob.key, glob.description, glob.value, glob.type], function(err, ret_info, self){
            console.log("ret_info: ", ret_info);
            console.log("self: ", self);
            if(err){
                ret_cb(err);
            }else{
                ret_cb(err, ret_info);
            }
        }, this);
    }

    update(glob, ret_cb){
        console.log("glob.value: ", glob.value);
        let str = "UPDATE global SET key=\'"+ glob.key + "\', description=\'" + glob.description + "\', value=\'" + glob.value + "\', type=\'" + glob.type + "\' WHERE key=\'" + glob.old_key + "\';"
        db_manager.runSqlCmd(str, function(err){
            ret_cb(err);
        });
    }
}


module.exports = new GlobalDao();