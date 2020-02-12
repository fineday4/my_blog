const db_manager = require('../../lib/db_manager');

class UsersDao
{
    constructor(){
        this.TABLE_NAME = "users";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE users(
                    name      CHAR(12)  NOT NULL PRIMARY KEY,
                    passwd    TEXT      NOT NULL,
                    auth      INTEGER   DEFAULT 2,
                    email     TEXT      NOT NULL
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

    update(user, res){
        db_manager.runSqlCmd("UPDATE users SET (name, passwd, email, auth) WHERE name=?",[user.name, user.passwd, user.email, user.auth], function(err, self){
            if(err){
                res.json({success:false, message: "修改失败!可能是名字重复"});
            }else{
                console.log("修改成功");
                res.json({success:true, message: "修改成功"});
            }
        });
    }
    
    insert(user, res){
        // console.log("qqqqqq user: ", user);
        console.log(`INSERT INTO users (name, passwd, email, auth) VALUES(?, ?, ?, ?)`, user.name, user.passwd, user.email, user.auth);
        db_manager.runSqlCmd(`INSERT INTO users (name, passwd, email, auth) VALUES(?, ?, ?, ?)`, [user.name, user.passwd, user.email, user.auth], function(err){
            if(err){
                console.log("err: ", err);
                res.json({success: false, message:"注册的用户名相同，求修改注册的名字"});
            }else{
//                self.getOne(ret_info.name, ret_cb);
                res.json({success: true, message: "请重新登录"});
            }
        }, this);
    }

    getOne(name, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM users WHERE name = ?`, [name] ,ret_cb);
    }

    getAll(user , ret_cb){
        if(user.auth == 7){
            db_manager.queryAllSqlCmd(`SELECT * FROM users`, ret_cb);
        }
    }

    delete(user, res, ret_cb){
        if(user.auth == 7){
            db_manager.runSqlCmd("DELETE FROM users WHERE name =\'" + user.name + "\'","",ret_cb);
            res.json({success: true});
        }else{
            res.json({success: false, message: "没有权限删除用户"});
        }
    }
}


module.exports = new UsersDao();