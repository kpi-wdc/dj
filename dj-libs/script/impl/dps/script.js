var jp = require("jsonpath");
var Promise = require("bluebird");
var Script = require("../../index");
var copy = require("../../../deep-copy");

var DPSRunError = function(message) {
    this.message = message;
    this.name = "Command 'run' implementation error";
}
DPSRunError.prototype = Object.create(Error.prototype);
DPSRunError.prototype.constructor = DPSRunError;


module.exports = {
    name: "run",
    synonims: {
        "run": "run",
        "execute": "run",
        "exec": "run"
    },
    "internal aliases":{
        "script": "script"
    },

    defaultProperty: {
        "run": "script",
        "execute": "script",
        "exec": "script"
        
    },

    execute: function(command, state, config) {

        try {
            return new Promise(function(resolve, reject) {
                if (!command.settings.script && state.head.type != "dps") 
                    throw new DPSRunError("Incompatible context type: '" + state.head.type+"'. Use 'dps()' command to convert context to 'dps' type")
                var script = (command.settings.script) ? command.settings.script : state.head.data;
                var parent = state.instance;
                var s = new Script()
                    .config(parent.config())
                    .script(script)
                s._state = {
                    locale: state.locale,
                    instance: s,
                    storage: copy(state.storage),
                    head: copy(state.head)
                }
                s.run()
                    .then(function(result) {
                        state.head =result;
                        resolve(state)
                    })
                    .catch(function(e) {
                        reject(e)
                    })
            })
        } catch (e) {
            throw e
        }

    },

    help: {
        synopsis: "Run DJ DP script",

        name: {
            "default": "run",
            synonims: ["run", "execute", "exec"]
        },
        input:["any", "dps (if script is not assigned)"],
        output:"output context of executed script",

        "default param": "script",
        params: [{
            name: "script",
            synopsis: "Bindable script (optional). If script is not assigned then input context will be interpreted as script.",
            type:["bindable"],
            synonims: [],
            "default value": "script context"
        }],
        example: {
            description: "Run script",
            code:   "<%version()%>\n"+
                    "set('script')\n"+
                    "dps()\n"+
                    "run()\n"+
                    "info()\n"+
                    "run('{{script}}')\n"+
                    "info()\n"+
                    "log()\n"
        }
    }
}
