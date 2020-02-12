const db_manager = require('../../lib/db_manager');

class AutoTaskExcCode
{
    constructor(){
        this.TABLE_NAME = "exc_code";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE exc_code(\
                        code INTEGER NOT NULL PRIMARY KEY,\
                        desc TEXT NOT NULL\
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
    
    getOne(info, ret_cb) { 
        db_manager.queryOneSqlCmd(`SELECT * FROM exc_code WHERE code = ?`, [info], ret_cb);
    }

}


module.exports = new AutoTaskExcCode();