
let fs = require('fs');


class ConfManager
{
    constructor(){
        this.conf_json = JSON.parse(fs.readFileSync(__dirname+"/../private/conf.json", 'utf8'));
    }

    getConf(){
        return this.conf_json;
    }
}


module.exports = new ConfManager();