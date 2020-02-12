const conf_manager = require("./conf_manager");

const ipc_method_ = conf_manager.getConf().ipc_method;
let ros_manager_;

if("ros" === ipc_method_){
    ros_manager_ = require("./ipc_impl/ros_manager");
}


class IpcManager
{
    constructor(){
        // console.log("conf_manager: ", conf_manager.getConf());
        this.ipc_method = conf_manager.getConf().ipc_method;

    }

    subscribe(topic, ret_cb){
        if(!ros_manager_){
            console.log("  ROS manager disabled !!!!!!!!!");
            return;
        }

        ros_manager_.subTask(topic, ret_cb);
    }
    
    publish(topic, data){
        if(!ros_manager_){
            console.log("  ROS manager disabled !!!!!!!!!");
            return;
        }

        if("/mb_onlinetasks" === topic){
            ros_manager_.pubTask(data);
        }

    }
}

module.exports = new IpcManager();