const rosnodejs = require("rosnodejs");

let _pub;
rosnodejs.initNode("initval_node");
const nh = rosnodejs.nh;


class RunTask{
    constructor(){
        // pub
        _pub = nh.advertise('/mb_onlinetasks', 'lxind_msgs/NavTasks');
    }

    subTaskStatus(topic, msg_type, ret_cb){
        nh.subscribe(topic, msg_type, ret_cb);
    }
    
    pubTask(msg_tasks){
        _pub.publish(msg_tasks);
    }
}


module.exports = new RunTask();
