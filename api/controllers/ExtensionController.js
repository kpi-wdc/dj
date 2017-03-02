var fs = require("fs")
var conf = require("./impl")
    .concat(require("../../dj-libs/script/dps-config"));
var Script = require("../../dj-libs/script");
var util = require("util");

module.exports = {

    getLibraryDef: function(req, resp) {
        resp.send(sails.config.dpsLibrary)
    },

    runExtension: function(req, resp){

        var extension = req.params.extension;
        var state = req.body.state;

        if(extension == "test"){
            return resp.send({
                type: "json",
                data:{
                    extension: extension,
                    state: state
                }
            })
        }
        
        var pathes = {
            getChannelItems: "./.tmp/public/lib/load/rss/get-channel-items.dps",
            getChannelHeadlines: "./.tmp/public/lib/load/rss/get-channel-headlines.dps",
            newsWordTable: "./.tmp/public/lib/load/rss/news-word-table.dps"
        }

        var path = pathes[extension];
       
        if(!path) return resp.send({
            type:"error", 
            data:{
                name:"ExtensionError", 
                message:"Extension "+ JSON.stringify(extension) +" not implemented on server side"
            }
        })

        var script = fs.readFileSync(path).toString()

         
        var executable = new Script()
        state.instance = executable;
        executable
            .config(conf)
            .script(script)
            .state(state)
            .run(state)
            .then(function(result) {
                resp.send(result)
            })
            .catch(function(error) {
                resp.send({ type: "error", data: error })
            })
    }

}
