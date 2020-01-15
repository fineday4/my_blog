
let chai = require('chai');
let assert = require('assert');
const chai_http = require('chai-http');

let server_app = require('../web/server');

chai.use(chai_http);

let requester = chai.request(server_app).keepOpen();


describe("#web_inspect.js", ()=>{
    describe("#rcp_test", ()=>{
        it("GET get_list/:rob_type", (done)=>{
            requester.get("/action/inspect/get_list/fr1511c").end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).data;
                console.log("-----------------------------");
                console.log("ret_json_ary: ", ret_json_ary);
                console.log("type: ", typeof ret_json_ary);
                
                // if(ret_json_ary.length > 0){
                //     assert.notStrictEqual(ret_json_ary[0].id, undefined);
                //     assert.notStrictEqual(ret_json_ary[0].name, undefined);
                //     assert.notStrictEqual(ret_json_ary[0].datetime, undefined);
                //     assert.notStrictEqual(ret_json_ary[0].talked, undefined);
                // }

                // chai.expect(res).to.have.status(200);
                // // chai.expect(res).to.be.json("id");
                // // chai.expect(res).to.have.param("id");
                done();
            });
        });
    });

    describe("#uri_test: inspect_module", ()=>{
        it("GET inspect_module all", (done)=>{
            requester.get("/inspect/module").end(function(err, res){
                let ret_json_ary = JSON.parse(res.text).data;
                console.log("-----------------------------");
                console.log("ret_json_ary: ", ret_json_ary);
                
                if(ret_json_ary.length > 0){
                    assert.notStrictEqual(ret_json_ary[0].name, undefined);
                    assert.notStrictEqual(ret_json_ary[0].description, undefined);
                }

                chai.expect(res).to.have.status(200);
                // chai.expect(res).to.be.json("id");
                // chai.expect(res).to.have.param("id");
                done();
            });
        });

        it("GET inspect_module one", (done)=>{
            requester.get("/inspect/module/roller").end(function(err, res){
                let ret_json_item = JSON.parse(res.text).data;
                console.log("-----------------------------");
                console.log("111 ret_json_item: ", ret_json_item);
                
                if(ret_json_item){
                    assert.notStrictEqual(ret_json_item.name, undefined);
                    assert.notStrictEqual(ret_json_item.description, undefined);

                    assert.strictEqual(ret_json_item.description, "辊筒模块");
                }

                chai.expect(res).to.have.status(200);
                // chai.expect(res).to.be.json("id");
                // chai.expect(res).to.have.param("id");
                done();
            });
        });
    });


});