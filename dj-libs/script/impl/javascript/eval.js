var util = require("util");
var copy = require("../../../deep-copy");
var Promise = require("bluebird");
var vm = require("vm");

var EvalImplError = function(message) {
    this.message = message;
    this.name = "Command 'evaluate' implementation error";
}
EvalImplError.prototype = Object.create(Error.prototype);
EvalImplError.prototype.constructor = EvalImplError;

module.exports = {
    name: "eval",
    synonims: {
        "eval": "eval",
        "evaluate": "eval",
        "js": "eval",
        "javascript": "eval"
    },

    defaultProperty: {},

    execute: function(command, state, config) {
        return new Promise(function(resolve, reject) {
            if (state.head.type != "string") reject( new EvalImplError("Incompatible context type: " + state.head.type+". Use context injection or 'str()' command to convert context to 'string' type"))
       
            try {

                const sandbox = {};
                sandbox.$context = state.storage;
                sandbox._ = require("lodash-node");
                const script = new vm.Script(state.head.data);
                const context = new vm.createContext(sandbox);
                script.runInContext(context);
                
                state.head = {
                    data: sandbox,
                    type: typeof sandbox
                }
                
                resolve(state)


            } catch (e) {
                reject(new EvalImplError(e.toString()))
            }
        })
    },

    help: {
        synopsis: "Evaluate context as javascript",

        name: {
            "default": "eval",
            synonims: ["eval", "evaluate", "js","javascript"]
        },

        "default param": "none",
        input:["string"],
        output:"object",

        params: [],

        example: {
            description: "Create javascript callbacks",
            code:   "<%\n"+
                    "var eqFirstMeta = function(a,b){\n"+
                    "  return a.metadata[0].id == b.metadata[0].id\n"+
                    "}\n"+
                    "var nullCount = function(values){\n"+
                    " return values.filter(function(d){\n"+
                    "   return d == null\n"+
                    " }).length\n"+
                    "}\n"+
                    "%>\n"+
                    "js()\n"+
                    "set('f')\n"+
                    "get('f.eqFirstMeta')\n"+
                    "info('eqFirstMeta')\n"+
                    "info()\n"+
                    "get('f.nullCount')\n"+
                    "info('nullCount')\n"+
                    "info()\n"+
                    "log()"
        }
    }
}
