// data imputation

var transposeTable = require("../table/transpose").transpose;
var util = require("util");


var ImputImplError = function(message) {
    this.message = message;
    this.name = "Command 'imput' implementation error";
}
ImputImplError.prototype = Object.create(Error.prototype);
ImputImplError.prototype.constructor = ImputImplError;




var impl = function(table, params) {
    // if(!params.inputation) return table;
    // if(!params.inputation.enable) return table;
    var inputation = (params.inputation) ? params.inputation : params;
    var direction = (inputation.direction) ? inputation.direction : "Rows"; //"Columns"
    var from = (inputation.from) ? inputation.from : "left"; //"right"
    var mode = (inputation.mode) ? inputation.mode : "fill"; //"mean","fit", ... etc

    if (direction == "Columns") table = transposeTable(table, { transpose: true });

    table.body.forEach(function(row) {
        if (mode == "fill") {
            if (from == "left") {
                var leftValue = row.value[0];
                row.value = row.value.map(function(v) {
                    if (v == null) return leftValue
                    leftValue = v;
                    return v;
                })

                // input current value as left value 
            } else {
                // input current value as right value
                throw new ImputImplError("Method 'fill' from right not implemented")
            }
        }
        if (mode == "mean") {
            // input current value as mean between left and right
            throw new ImputImplError("Method 'mean' not implemented")
        }
        if (mode == "fit") {
            // input current value as fitted value between left and right
            throw new ImputImplError("Method 'fit' not implemented")

        }
    })

    if (direction == "Columns") table = transposeTable(table, { transpose: true });

    return table;
}

module.exports = {
    name: "imputation",

    synonims: {
        "imputation": "imputation",
        "imput": "imputation"
    },
    
    "internal aliases": 
    {   "direction": "direction",
        "dir": "direction",
        "for": "direction",
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",
        "from": "from",
        "left": "left",
        "top": "left",
        "t": "left",
        "l": "left",
        "right": "right",
        "r": "right",
        "bottom": "right",
        "b": "right",
        "mode": "mode",
        "method": "mode",
        "fill": "fill",
        "fit": "fit",
        "mean": "mean",
        "avg": "mean"
    },

    defaultProperty: {
        "imputation": "from",
        "imput": "from"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new ImputImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Rows",
            mode: params.mode || "fill",
            from: params.from || "left"
        } : {
            direction: "Rows",
            mode: "fill",
            from: "left"
        }


        if (params.direction != "Rows" && params.direction != "Columns")
            throw new ImputImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        if (params.mode != "fill" && params.mode != "mean" && params.mode != "fit")
            throw new ImputImplError("Incompatible mode value: " + JSON.stringify(params.mode) + ".")

        if (params.from && params.from != "left" && params.from != "right")
            throw new ImputImplError("Incompatible from value: " + JSON.stringify(params.from) + ".")


        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new ImputImplError(e.toString())
        }
        return state;
    },

    help: {
        synopsis: "Fill backspaces",

        name: {
            "default": "imputation",
            synonims: ["imputation", "imput"]
        },
        input:["table"],
        output:"table",
        "default param": "from",
        params: [{
            name: "direction",
            synopsis: "Direction of iteration (optional)",
            type:["Rows", "row", "Columns", "col"],
            synonims: ["direction", "dir", "for"],
            "default value": "Columns"
        }, {
            name: "mode",
            synopsis: "Imputation mode (optional)",
            type:["fill", "fit", "mean", "avg"],
            synonims: ["mode", "method"],
            "default value": "fill"
        }, {
            name: "from",
            synopsis: "Direction for fill mode (optional)",
            type:["left", "l", "right", "r", "top", "t", "bottom", "b"],
            synonims: [],
            "default value": "left"
        }],
        example: {
            description: "Fill backspaces for each columns by fill from top",
            code: "<?json\n    {\n  \"header\": [\n    {\n      \"metadata\": [\n        {\n          \"id\": \"0\",\n          \"label\": \"Col 0\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"1\",\n          \"label\": \"Col 1\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"2\",\n          \"label\": \"Col 2\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    }\n  ],\n  \"body\": [\n    {\n      \"metadata\": [\n        {\n          \"id\": \"0\",\n          \"label\": \"0\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        366.71,\n        928.25,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"1\",\n          \"label\": \"1\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        null,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"2\",\n          \"label\": \"2\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        923.05,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"3\",\n          \"label\": \"3\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        927.38,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"4\",\n          \"label\": \"4\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        368.6,\n        928.18,\n        null\n      ]\n    }\n  ]\n}\n?>\n\ntable()\n\nremove(dir:\"col\", mode:'all')\nremove(dir:'row', mode:'all')\nimput(for:'col', from:'top', method:'fill')\n\n"

        }
    }
}
