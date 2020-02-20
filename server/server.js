#!/usr/local/bin/node

const express = require('express');
const session = require("express-session");
const body_parser = require('body-parser');

// controllers

// pcfg
const pcfg_param_controller = require('./controller/pcfg/pcfg_param_controller');
const pcfg_rpc_controller = require('./controller/pcfg/pcfg_rpc_controller');


let app = express();

const PORT = 8080;

// set
// app.set('view engine', 'pug');//设置渲染引擎
// app.set('views','./views');  //设置views的文件夹

// 
// app.use("/public", express.static("public"));
// app.use("/node_modules", express.static("node_modules"));

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(session({
        secret: 'lx-tech', //使用随机自定义字符串进行加密
        saveUninitialized: true,//不保存未初始化的cookie，也就是未登录的cookie
        cookie: {
                    maxAge: 2*60*60 * 1000, //设置cookie的过期时间为2个小时  maxAge: 24 * 60 * 60 * 1000
                    activeDuration: 5*60*1000, // 激活时间，比如设置为30分钟，那么只要30分钟内用户有服务器的交互，那么就会被重新激活。   5* 60*1000,
        },
        resave: false
    }))


/// routes
app.use("/action/pcfg", pcfg_rpc_controller);
app.use("/pcfg/param", pcfg_param_controller);


/// app
let server = app.listen(PORT, ()=>{
    console.log("server listening on: " + server.address().port);
});


module.exports = app;