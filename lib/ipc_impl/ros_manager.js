
const rosnodejs = require("rosnodejs");

// ros msgs
const _finder = _ros_msg_utils.Find;
let lxind_msgs = _finder('lxind_msgs');

const nav_task = lxind_msgs.msg.NavTask;
const nav_tasks = lxind_msgs.msg.NavTasks;
const task_status = lxind_msgs.msg.TaskStatus;
const task_statuses = lxind_msgs.msg.TaskStatuses; 

let msg_tasks = new nav_tasks();;
let msg_task = new nav_task();
let msg_status = new task_status();
let msg_statuses = new task_statuses();


class RosManager
{
    constructor(){
        rosnodejs.initNode("js_node").then(()=>{
            this.nh = rosnodejs.nh;
            this.pub = this.nh.advertise('/mb_onlinetasks', 'lxind_msgs/NavTasks');

            this.cb_sub_task_status();
        });

        this.cb_sub_task_status = undefined;
    }

    subTask(topic, ret_cb){
        
        this.cb_sub_task_status = function(){
            this.nh.subscribe(topic, task_statuses.datatype(), (msg)=>{
                let resolved_msg = task_statuses.Resolve(msg);
                ret_cb(resolved_msg);
            });
        }
    }

    pubTask(data){
        msg_task.pri_task_cmd = data.pri_task_cmd;
        msg_task.task_id = data.task_id;
        console.log(msg_task);
        msg_tasks.tasks = [msg_task];
        this.pub.publish(msg_tasks);
    }
}


module.exports = new RosManager();