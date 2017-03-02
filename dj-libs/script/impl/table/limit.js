// limits table rows
var util = require("util");


var LimitImplError = function(message) {
    this.message = message;
    this.name = "Command 'limit' implementation error";
}
LimitImplError.prototype = Object.create(Error.prototype);
LimitImplError.prototype.constructor = LimitImplError;



var impl = function(table, params) {
    var limit = (params.limit) ? params.limit : params;

    table.body = table.body.filter(function(item, index) {
        return ((index + 1) >= limit.start) && ((index + 1) < (limit.start + limit.length))
    })

    return table;
}

module.exports = {
    name: "limit",

    synonims: {
    },

    "internal aliases":{
        "start": "start",
        "s": "start",
        "length": "length",
        "l": "length"
    },

    defaultProperty: {
        "limit": "length"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new LimitImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            start: (params.start) || 1,
            length: (params.length) || 1
        } : {
            start: 1,
            length: 1
        }

        if (!util.isNumber(params.start))
            throw new LimitImplError("Incompatible start value: " + JSON.stringify(params.start) + ".")

        if (!util.isNumber(params.length))
            throw new LimitImplError("Incompatible length value: " + JSON.stringify(params.length) + ".")


        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new LimitImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Limit table rows",

        name: {
            "default": "limit",
            synonims: []
        },
        input:["table"],
        output:"table",
        "default param": "length",
        params: [{
                name: "start",
                synopsis: "1-based index of start row (optional)",
                type:["number"],
                synonims: ["start", "s"],
                "default value": 1
            }, {
                name: "length",
                synopsis: "Number of rows (optional)",
                type:["number"],
                synonims: ["length", "l"],
                "default value": 1
            }

        ],
        example: {
            description: "Limit table rows",
            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:\"dataset\")\r\n    \r\nproj([\r\n    { dim:'time', as:'row'},\r\n    { dim:'indicator', as:'col'}\r\n])\r\n\r\nlimit(s:1,l:2)\r\n"
        }
    }
}
