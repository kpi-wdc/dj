var bayesSimulator = require("../../../bayes-simulator");

var BbnImplError = function(message) {
    this.message = message;
    this.name = "Command 'bbn' implementation error";
}
BbnImplError.prototype = Object.create(Error.prototype);
BbnImplError.prototype.constructor = BbnImplError;

module.exports = {
    name: "bbn",
    synonims:{
        "simulator":"bbn"
    },
    "internal aliases": {
        "model": "model",
        "desc":"model"
    },

    defaultProperty:{
        "bbn" : "model",
        "simulator": "model"
    },

    execute: function(command, state) {  
        if (!command.settings.model && state.head.type != "json")
            throw new BbnImplError("Incompatible context type: '" + state.head.type + "'.");
        var model = command.settings.model || state.head.data;
        try {
            state.head = {
                data: bayesSimulator(model),
                type: "bbn-simulator"
            }
        } catch (e) {
            throw new BbnImplError(e.toString());
        }

        return state;
    },
    help: {
        synopsis: "Build dependency wheel chart serie",

        name: {
            "default": "deps",
            synonims: []
        },
        input:["table (shuld be correlation matrix)"],
        output:"deps",
        "default param": "none",
        params: [],
        example: {
            description: "Build dependency wheel chart serie",
            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:'time', as:'row'},\r\n    {dim:'indicator', as:'col'}\r\n])\r\n\r\ncorr(for:'col')\r\ndeps()\r\n"
        }
    }
}