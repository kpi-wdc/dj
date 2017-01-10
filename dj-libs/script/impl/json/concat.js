var util = require("util");

var ConcatImplError = function(message) {
    this.message = message;
    this.name = "Command 'concat' implementation error";
}
ConcatImplError.prototype = Object.create(Error.prototype);
ConcatImplError.prototype.constructor = ConcatImplError;

module.exports = {
    name: "concat",
    synonims: {},


    defaultProperty: {},

    execute: function(command, state, config) {
        try {

            var res;
            state.head.data.forEach(function(d){
                if(!util.isArray(d) && !util.isString(d))  throw new ConcatImplError("Incompatible item type: "+(typeof d))
                if(util.isArray(d)) {
                    res = res || [];
                    res = res.concat(d)
                }else{
                    res = res || "";
                    res += d;
                }    
            })
            state.head = {
                data: res,
                type: "json"
            }
        } catch (e) {
            throw new ConcatImplError(e.toString())
        }

        return state;
    },

    help: {
        synopsis: "Concat context items",

        name: {
            "default": "eval",
            synonims: ["eval", "evaluate"]
        },
        input:["json"],
        output:"json",
        "default param": "none",

        params: [],

        example: {
            description: "Get tags for all datasets",
            code:   "meta('$..dataset.topics')\n"+
                    "concat()\n"+
                    "unique()\n"+
                    "extend()\n"+
                    "translate()"
        }
    }
}
