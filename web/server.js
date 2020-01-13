#!/usr/local/bin/node

const express = require('express');
const session = require("express-session");
const body_parser = require('body-parser');

// controllers
const inspect_robtype_controller = require('./controller/inspect_robtype_controller');
const inspect_rpc_controller = require("./controller/inspect_rpc_controller");
const robot_module_controller = require("./controller/robot_module_controller");

let app = express();

const PORT = 8080;

// set
app.set('view engine', 'pug');//设置渲染引擎
app.set('views','./views');  //设置views的文件夹

// 
app.use("/public", express.static("public"));
// app.use("/node_modules", express.static("node_modules"));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(session({secret:"hola", resave:false, saveUninitialized:true}));


/// routes
app.use("/inspect/robtype", inspect_robtype_controller);
app.use("/inspect/rob_module", robot_module_controller);
app.use("/action/inspect", inspect_rpc_controller);


/// app
let server = app.listen(PORT, ()=>{
    console.log("server listening on: " + server.address().port);
});


module.exports = app;