
const fs = require('fs');
const db_manager = require('../../lib/db_manager');
const _ = require('loadsh');

fs.readFile(__dirname + '/config.json', 'utf8', function(err, data){  // A.读取config.json配置文件
    if(err) throw err;
    try{
       // console.log(data);
        let config = JSON.parse(data);
        db_manager.runSqlCmd(`INSERT INTO global(key, value, type, description) VALUES (?, ?, ?, ?)`, ['robot', config.robots[0].name, 'string', config.robots[0].description], function(err){
            if(err){
             console.log("INSERT INTO global error!!!!!");
            }else{
                console.log("INSERT INTO global success");
            }
        }); 
        readRobot(config.robots, 0);
        writeUser(config.users);
        _(config.robots).forEach(element => {
            console.log("element: ", element);
            db_manager.runSqlCmd(`INSERT INTO pcfg_robot(name, description) VALUES (?, ?)`, [element.name, element.description], function(err){
                if(err){
                 console.log("INSERT INTO pcfg_robot error!!!!!");
                }else{
                    console.log("INSERT INTO pcfg_robot success");
                }
            });            
        });
    }catch(ex){
        console.log('Error !!!!!!');
    }
});

//TODO:写入robot表
function readRobot(config, idx)      //B1.读取robot的配置文件
{
  //  console.log("config.length: ", config.length);
    if(config.length > idx){
     //   console.log("config: ", config[idx]);
        fs.readFile(__dirname + '/' + config[idx].name + '.json','utf8',function (err, data){
            if (err) throw err;
            try {
                //TODO:写入module表
                writeModule(JSON.parse(data));
                //TODO:写入submodule表
                //writeSubModule(JSON.parse(data));
                //TODO:写入paraments表
                //TODO:写入rob2submod表, 需要知道当前配置文件的车型
                writeRob2SubModule(config[idx], JSON.parse(data));
               // console.log("new_fr1511b_elev: ", data);
            }catch(ex) {
                console.log('Error P~~~~~~~~s:: ', ex);
            }
        });
    }
}

function writeModule(modu)  //C1. 将数据写入到module表中
{
    for(let key in modu){
       // let descri = JSON.parse();
        for(let key1 in modu[key][0]){
           db_manager.runSqlCmd(`INSERT INTO pcfg_module(name, description) VALUES (?, ?)`, [key, modu[key][0]['description']], function(err){
               if(err){
                console.log("INSERT INTO pcfg_module error!!!!!");
               }else{
                   console.log("INSERT INTO pcfg_module success");
               }
           });
       }
    }
}

function writeRob2SubModule(robotype, rob2submodu){  //C2. 将数据写入rob2submod表中, 将数据写入paraments中
    for(let item1 in rob2submodu){
        for(let item2 in rob2submodu[item1]){
            for(let item3 in rob2submodu[item1][item2]){
                if(item3 == "instance"){
                    db_manager.runSqlCmd(`INSERT INTO pcfg_rob2submod_rel(rob_id, sub_id) VALUES (?, ?)`, [robotype.name, rob2submodu[item1][item2][item3]], function(err){
                        if(err){
                         console.log("INSERT INTO rob2submod error!!!!!");
                        }else{
                            console.log("INSERT INTO rob2submod success");
                        }
                    });
                    db_manager.runSqlCmd(`INSERT INTO pcfg_submodule(name, module, description) VALUES (?, ?, ?)`,[rob2submodu[item1][item2].instance, item1, rob2submodu[item1][item2].description], (err)=>{
                        if(err){
                            console.log("INSERT INTO pcfg_submodule error!!!!!");
                        }else{
                            console.log("INSERT INTO pcfg_submodule success ");
                        }
                    }) 
                }else{
                    db_manager.runSqlCmd(`INSERT INTO pcfg_parameter(name, value, sub_id, type, description) VALUES (?, ?, ?, ?, ?)`, [item3, rob2submodu[item1][item2][item3]['value'], rob2submodu[item1][item2]['instance'], rob2submodu[item1][item2][item3]['type'], rob2submodu[item1][item2][item3]['description']], function(err){
                        if(err){
                            console.log("INSERT INTO paraments error!!!!!");
                        }else{
                            console.log("INSERT INTO paraments success");
                        }
                    });
                }
            }
        }
    }
}

//TODO:写入users表
function writeUser(users)  //B2. 写入users表
{
   // console.log("users: ", users);
    for(let user in users){
        db_manager.runSqlCmd(`INSERT INTO users(name, passwd, auth, email) VALUES (?, ?, ?, ?)`, [user, users[user]['passwd'], users[user]['privilege'], users[user]['email']], function(err){
            if(err){
             console.log("INSERT INTO users error!!!!!");
            }else{
                console.log("INSERT INTO users success");
            }
        });
    }
}