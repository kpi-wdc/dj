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
                synonims: ["direction", "dir", "for"],
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
            code: "<?json\n    {\n  \"header\": [\n    {\n      \"metadata\": [\n        {\n          \"id\": \"0\",\n          \"label\": \"Col 0\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"1\",\n          \"label\": \"Col 1\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"2\",\n          \"label\": \"Col 2\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    }\n  ],\n  \"body\": [\n    {\n      \"metadata\": [\n        {\n          \"id\": \"0\",\n          \"label\": \"0\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        366.71,\n        928.25,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"1\",\n          \"label\": \"1\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        null,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"2\",\n          \"label\": \"2\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        923.05,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"3\",\n          \"label\": \"3\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        927.38,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"4\",\n          \"label\": \"4\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        368.6,\n        928.18,\n        null\n      ]\n    }\n  ]\n}\n?>\n\ntable()\n\nremove(dir:\"col\", mode:'all')\nremove(dir:'row', mode:'all')\n\nmerge(from:1, to:0)\n"

        }
    }
}
