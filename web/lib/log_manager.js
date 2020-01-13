
const log4js = require('log4js');
const os = require('os');
const fs = require('fs');



class LogItem 
{
    constructor(name){
        this.file_name_prefix = name;
        this.log_obj = undefined;
    }
}

// this.cate_map:
// ex.
// {
//    TALKER: {file_name_prefix: "talker", logger: lg_obj1},
//    CHATTER: {file_name_prefix: "chatter", logger: lg_obj2}
// }

class LogManager
{
    constructor(){
        this.cate_map = {};

        // create web log dir
        this.log_dir = os.homedir() + "/.weblog/";
        if(!fs.existsSync(this.log_dir)){
            fs.mkdirSync(this.log_dir);
        }
    }

    addLogger(categoty, file_name_prefix){
        // console.log("-----------------");

        if(!file_name_prefix){
            file_name_prefix = categoty.toLowerCase();
        }

        this.cate_map[categoty] = new LogItem(file_name_prefix);

        // console.log("this.cate_map: ", this.cate_map);
        // console.log("+++++++++++++++++++++++++");
    }

    setup(){
        let appenders_data = {};
        let appenders_ary = [];
        
        for(var key in this.cate_map){
            const log_file = this.log_dir + this.cate_map[key].file_name_prefix + ".log";
            appenders_data[key] = {type:"file", filename:log_file};
            appenders_ary.push(key);
        }

		log4js.configure({appenders:appenders_data,
						categories: {default:{appenders:appenders_ary, level:"info"}}
        });
        
        // set logger obj after cfg
        for(var key in this.cate_map){
            console.log("KEY: ", key);
            this.cate_map[key].logger =  log4js.getLogger(key);
        }

        // console.log("this.cate_map: ", this.cate_map);
    }

    getLogger(category){
        return this.cate_map[category].logger;
    }

    log_info(category, msg){
        this.cate_map[category].logger.info(msg);
    }

    log_cout_info(category, msg){
        // if(true === conf_json_.debug_mode){
        console.log(msg);
        // }
        this.cate_map[category].logger.info(msg);
    }
}


module.exports = new LogManager();