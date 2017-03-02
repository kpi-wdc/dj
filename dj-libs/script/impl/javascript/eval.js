var util = require("util");
var copy = require("../../../deep-copy");
var Promise = require("bluebird");
var vm = require("vm");
var dt = require("date-and-time");
var q = require('../../../query/query').criteria;

var EvalImplError = function(message) {
    this.message = message;
    this.name = "Command 'evaluate' implementation error";
}
EvalImplError.prototype = Object.create(Error.prototype);
EvalImplError.prototype.constructor = EvalImplError;
var implementation = function(state){
        try {

                const sandbox = {};
                sandbox.$scope = state.storage;
                sandbox._ = require("lodash-node");
                sandbox._util = {
                    format:{
                        date: function(value,format){
                           format = format || "YYYY MM DD";
                           return dt.format(value,format)
                        }
                    },
                    parse:{
                        number: function(value){return value/1},
                        date: function(value,format){
                            format = format || "YYYY MM DD";
                            return dt.parse(value,format)
                        }
                    },
                    comparator:q
                };

                const script = new vm.Script(state.head.data);
                const context = new vm.createContext(sandbox);
                script.runInContext(context);
                // delete sandbox._util;
                // delete sandbox._;
                
                state.head = {
                    data: sandbox,
                    type: typeof sandbox
                }
                
                return state


            } catch (e) {
               throw new EvalImplError(e.toString())
            }
    }

module.exports = {
    name: "eval",
    synonims: {
        "eval": "eval",
        "evaluate": "eval",
        "js": "eval",
        "javascript": "eval"
    },

    defaultProperty: {},

    implementation:implementation,

    execute: function(command, state, config) {
        return new Promise(function(resolve, reject) {
            if (state.head.type != "string") reject( new EvalImplError("Incompatible context type: " + state.head.type+". Use context injection or 'str()' command to convert context to 'string' type"))
            try{
                resolve(implementation(state))
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
            code:  "<?javascript\n    \n    var eqFirstMeta = function(a,b){\n      return a.metadata[0].id == b.metadata[0].id\n    }\n    \n    var nullCount = function(values){\n        return values.filter(function(d){\n            return d == null\n        }).length\n    };\n\n?>\n\nset('f')\n\nget('f.eqFirstMeta')\ninfo('eqFirstMeta')\ninfo()\n\nget('f.nullCount')\ninfo('nullCount')\ninfo()\n\nlog()\n"
        }
    }
}
