
let chai = require('chai');
let assert = require('assert');
const chai_http = require('chai-http');

let server_app = require('../web/server');

chai.use(chai_http);

let requester = chai.request(server_app).keepOpen();


describe("#server_test.js", ()=>{
    describe("#uri_talker", ()=>{
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
});
