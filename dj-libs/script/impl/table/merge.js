// aggregate table


var STAT = require("../lib/stat"),
    transposeTable = require("./transpose").transpose,
    util = require("util");

var MergeImplError = function(message) {
    this.message = message;
    this.name = "Command 'merge' implementation error";
}
MergeImplError.prototype = Object.create(Error.prototype);
MergeImplError.prototype.constructor = MergeImplError;


var impl = function(table, params) {

    var merge = (params.merge) ? params.merge : params;

    if (merge.direction == "Columns") table = transposeTable(table);
    var master = merge.master;
    var slave = merge.slave;

    var merged = []
    table.body[master].value.forEach(function(mValue, index) {
        merged.push((mValue != null) ? mValue : table.body[slave].value[index])
    })

    table.body[master].value = merged;


    if (merge.direction == "Columns") table = transposeTable(table);

    return table;
}

module.exports = {
    name: "merge",

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
        "master": "master",
        "target": "master",
        "destination": "master",
        "dest": "master",
        "to": "master",
        "slave": "slave",
        "from": "slave"
    },

    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new MergeImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Columns",
            master: params.master || 0,
            slave: params.slave || 0
        } : {
            direction: "Columns",
            master: 0,
            slave: 0
        }


        if (!util.isNumber(params.master))
            throw new MergeImplError("Incompatible master value: " + JSON.stringify(params.master) + ".")
        if (!util.isNumber(params.slave))
            throw new MergeImplError("Incompatible slave value: " + JSON.stringify(params.slave) + ".")

        if (params.direction != "Rows" && params.direction != "Columns")
            throw new MergeImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new MergeImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Replace master nulls from slave values",

        name: {
            "default": "merge",
            synonims: []
        },
        input:["table"],
        output:"table",
        "default param": "none",
        params: [{
                name: "direction",
                synopsis: "Direction of iteration (optional)",
                type:["Rows", "row", "Columns", "col"],
                synonims: ["direction", "dir"],
                "default value": "Columns"
            }, {
                name: "master",
                synopsis: "0-based index of master (optional)",
                type:["number"],
                synonims: ["master", "target", "destination", "dest", "to"],
                "default value": 0
            }, {
                name: "slave",
                synopsis: "0-based index of slave (optional)",
                type:["number"],
                synonims: ["slave", "source", "src", "from"],
                "default value": 0
            }

        ],
        example: {
            description: "Replace nulls in columns",
            code: "// get table with two columns\nmerge(from:1, to:0)\nmerge(to:2)\nmerge(from:2)"
        }
    }
}
