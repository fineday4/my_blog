let chai = require('chai');
let assert = require('assert');
const chai_http = require('chai-http');
const  expect = chai.expect ;
const should = chai.should();
let server_app = require('../web/server');

chai.use(chai_http);

let requester = chai.request(server_app).keepOpen();


describe("#web_pcfg.js", ()=>{
    describe("#get_test", ()=>{
        //获取所有机器人车型列表测试
        it("GET /action/pcfg/get_rob_list", (done)=>{
            requester.get("/action/pcfg/get_rob_list").end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).data;
                let success = JSON.parse(res.text).success;
                if(ret_json_ary.length > 0){
                    expect(success).to.deep.equal(true);
                    assert.notStrictEqual(ret_json_ary[0].name, undefined);
                    assert.notStrictEqual(ret_json_ary[0].description, undefined);
                }
                done();
            });
        });

        //获取指定机器人的参数列表（父子模块）测试
        it("GET /action/pcfg/get_param_list/:robot_name", (done)=>{  //GET /get_param_list/:robot_name
            requester.get("/action/pcfg/get_param_list/new_fr1511b_elev").end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).data;
                let success = JSON.parse(res.text).success;
                if(ret_json_ary.length > 0){
                    expect(success).to.deep.equal(true);
                    assert.notStrictEqual(ret_json_ary[0].module, undefined);
                    assert.notStrictEqual(ret_json_ary[0].description, undefined);
                    assert.notStrictEqual(ret_json_ary[0].children,undefined);
                }
                done();
            });
        });

        //获取指定子模块的所有参数测试
        it("GET /pcfg/param/:sub_id", (done)=>{  //GET /get_param_list/:robot_name
            requester.get("/pcfg/param/lx_base").end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).data;
                let success = JSON.parse(res.text).success;
                if(ret_json_ary.length > 0){
                    expect(success).to.equal(true);
                    assert.notStrictEqual(ret_json_ary[0].id, undefined);
                    assert.notStrictEqual(ret_json_ary[0].description, undefined);
                    assert.notStrictEqual(ret_json_ary[0].name, undefined);
                    assert.notStrictEqual(ret_json_ary[0].type, undefined);
                    assert.notStrictEqual(ret_json_ary[0].value, undefined);
                    assert.notStrictEqual(ret_json_ary[0].sub_id, undefined);
                    assert.notStrictEqual(ret_json_ary[0].privilege, undefined);
                }
                done();
            });
        });


    });

    describe("#put_test",()=>{
        //修改当前机器人车型测试
        it("PUT /action/pcfg/mod_robot/:user/:value/:description",(done)=>{
            requester.put('/action/pcfg/mod_robot/admin/new_fr1511b_elev/testxxx').end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).data;
                let success = JSON.parse(res.text).success;
                expect(success).to.deep.equal(true);
                done();
            })
        });

        //修改一个具体参数测试
        it("PUT /pcfg/param/:user/:id/:name/:value/:type/:description/:privilege", (done)=>{
            requester.put("/pcfg/param/admin/3/loop_rate/TTU/string/vaerg/21").end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).data;
                let success = JSON.parse(res.text).success;
                expect(success).to.deep.equal(true);
                done();            
            })
        })
    })

    describe("#post_test",()=>{
        //用户登录测试
        it("POST /action/pcfg/login", (done)=>{
            requester.post("/action/pcfg/login").type("form").send({name: "admin", passwd: "admin1234"}).end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).data;
                let success = JSON.parse(res.text).success;     
                expect(success).to.deep.equal(true);
                done();        
            })
        })

        //向全局表中添加当前机器人车型，如果全局表中没有设置当前车型，则success = true; 否则 success = false
        it("POST /action/pcfg/select_robot/:rob_name", (done)=>{
            requester.post("/action/pcfg/select_robot/new_fr1511b_elev").type("form").send({user: "admin"}).end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).message;
                let success = JSON.parse(res.text).success;     
                expect(success).to.deep.equal(false);
                done();        
            })     
        })
    })

    describe("#delete_test", ()=>{
        //删除具体参数测试
        it("DELETE /pcfg/param/:user/:id", (done)=>{
            requester.delete("/pcfg/param/admin/2").end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).message;
                let success = JSON.parse(res.text).success;     
                expect(success).to.deep.equal(true);
                done();                 
            })
        })
    })

});