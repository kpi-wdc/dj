
var util = require("util");
var transposeTable = require("./transpose").transpose;

var LastImplError = function(message) {
    this.message = message;
    this.name = "Command 'last' implementation error";
}
LastImplError.prototype = Object.create(Error.prototype);
LastImplError.prototype.constructor = LastImplError;



var impl = function(table, params) {
    var last = (params.last) ? params.last : params;
    var direction = (last.direction) ? last.direction : "Rows";
    var count = (last.count) ? last.count : 1;
    console.log(direction, count)
    if (direction == "Columns") table = transposeTable(table, { transpose: true });

    table.body = table.body.filter(function(item, index) {
        return (index >= (table.body.length-count)) && (index < table.body.length)
    })
    
    if (direction == "Columns") table = transposeTable(table, { transpose: true });
    return table;
}

module.exports = {
    name: "last",

    synonims: {
    },

    "internal aliases":{
        "direction": "direction",
        "dir": "direction",
        "for": "direction",
        
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",

        "length": "count",
        "count": "count"
    },

    defaultProperty: {
        "last": "count"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new LastImplError("Incompatible context type: '" + state.head.type + "'.")
        
        var table = state.head.data;
        var params = command.settings;

        // params = (params) ? {
        //     start: (params.start) || 1,
        //     length: (params.length) || 1
        // } : {
        //     start: 1,
        //     length: 1
        // }

        // if (!util.isNumber(params.start))
        //     throw new LastImplError("Incompatible start value: " + JSON.stringify(params.start) + ".")

        // if (!util.isNumber(params.length))
        //     throw new LastImplError("Incompatible length value: " + JSON.stringify(params.length) + ".")


        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new LastImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Get last rows of table",

        name: {
            "default": "last",
            synonims: []
        },
        input:["table"],
        output:"table",
        "default param": "count",
        params: [{
                name: "direction",
                synopsis: "Direction of iteration (optional)",
                type:["Rows", "row", "Columns", "col"],
                synonims: ["direction", "dir", "for"],
                "default value": 1
            }, {
                name: "count",
                synopsis: " (optional)",
                type:["number"],
                synonims: ["length", "count"],
                "default value": 1
            }

        ],
        example: {
            description: "Get last rows of table",
            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:\"dataset\")\r\n    \r\nproj([\r\n    { dim:'time', as:'row'},\r\n    { dim:'indicator', as:'col'}\r\n])\r\n\r\nlimit(s:1,l:2)\r\n"
        }
    }
}
