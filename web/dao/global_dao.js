const db_manager = require('../lib/db_manager');

class GlobalDao
{
    constructor(){
        this.TABLE_NAME = "global";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            if(!has){
                db_manager.runSqlCmd(
                    `CREATE TABLE global(
                        name  CHAR(20) NOT NULL PRIMARY KEY,
                        value VARCHAR(255)
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
        db_manager.queryOneSqlCmd(`SELECT * FROM global WHERE name = ?`, [name], (err, one_item)=>{
            if(err){
                console.log("err: ", err);
            }else{
                if(one_item){
                    // update
                    db_manager.runSqlCmd(`UPDATE global SET value = ? WHERE name = ?`, [value, name], ret_cb);

                }else{
                    // insert
                    db_manager.runSqlCmd(`INSERT INTO global VALUES (?, ?)`, [name, value], ret_cb);
                }
            }
        });
    }

    getVal(name, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM global WHERE name = ?`, [name] ,ret_cb);
    }

    delVal(name, ret_cb){
        db_manager.queryOneSqlCmd(`DELETE FROM global WHERE name = ?`, [name] ,ret_cb);
    }
}


module.exports = new GlobalDao();