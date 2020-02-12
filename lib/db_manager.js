const os = require('os');
const fs = require('fs');
const process = require('process');
const sqlite3 = require('sqlite3').verbose();

class DbManager
{
    constructor(){
        let db_dir = os.homedir() + "/.sqlitedb";
        console.log("db_dir", db_dir);
        if(!fs.existsSync(db_dir)){
            fs.mkdirSync(db_dir);
        }
        
        this.b_db_loaded = false;
        this.db = new sqlite3.Database(db_dir + "/app.db", ()=>{
            this.b_db_loaded = true;
            console.log("db loaded !");
        });
    }

    tableExist(str_name, ret_cb){
        this.db.serialize(()=>{
            this.db.get("SELECT * FROM sqlite_master WHERE type='table' AND name=?", str_name, function (err, row) {
                // console.log("row: ", row, ", err: ", err);
                if(!row){
                    console.log("table not exist");
                    ret_cb(false);
                }else{
                    console.log("table exist !");
                    ret_cb(true);
                }
            });
        });
    }

    runSqlCmd(str_cmd, param2, param3, param4){ 
        // console.log("typeof param2: ", typeof param2 ); 
        // console.log("typeof param2.isArray: ", param2.isArray ); 
        // console.log("typeof param3: ", typeof param3 ); 
        // console.log("param4: ", param4);

        let ary_param = [];
        if(typeof param2 == "object" && Array.isArray(param2)){
            ary_param = param2;
        }

        let ret_cb;
        if(typeof param2 === "function"){
            ret_cb = param2;
        }else if(typeof param3 === "function"){
            ret_cb = param3;
        }

        this.db.serialize(()=>{
            // console.log("000 runSqlCmd() ", str_cmd, ", ", ary_param, ", ret_cb: ", ret_cb);
            if(param4){
                this.db.run(str_cmd, ary_param, function(err){
                    ret_cb(err, {inserted_id: this.lastID, changed: this.changed}, param4);
                });
            }else{
                if(ret_cb){
                    this.db.run(str_cmd, ary_param, ret_cb);
                }else{
                    this.db.run(str_cmd, ary_param);
                }
            }
        });
    }
    
    queryAllbyConCmd(str_cmd, condition, ret_cb){
        this.db.serialize(()=>{
            this.db.all(str_cmd, condition, ret_cb);
        });
    }
    
    queryOneSqlCmd(str_cmd, param, ret_cb){ 
        // console.log("queryOneSqlCmd: ", str_cmd, ", param: ", param);
        this.db.serialize(()=>{
            if(ret_cb){
                this.db.get(str_cmd, param, ret_cb);
            }else{
                this.db.get(str_cmd);
            }
        });
    }

    queryAllSqlCmd(str_cmd, param, ret_cb){
        if(3 == arguments.length){
            this.db.serialize(()=>{
                // console.log("000 runSqlCmd() ", str_cmd, ", ret_cb: ", ret_cb);
                this.db.all(str_cmd, param, ret_cb);
            });
        }else if(2 == arguments.length){
            this.db.serialize(()=>{
                // console.log("000 runSqlCmd() ", str_cmd, ", ret_cb: ", ret_cb);
                if(typeof param == "function"){
                    this.db.all(str_cmd, param);
                }
            });
        }
    }


    close(){
        console.log(" db closed !");
        this.db.close();
    }
}


let db_mgr = new DbManager();

process.on("SIGINT", ()=>{
    db_mgr.close();
    process.exit();
});


module.exports = db_mgr;