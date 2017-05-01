// reduce rows(columns) with nulls
// 
var RedNImplError = function(message) {
    this.message = message;
    this.name = "Command 'reducenulls' implementation error";
}
RedNImplError.prototype = Object.create(Error.prototype);
RedNImplError.prototype.constructor = RedNImplError;

module.exports = {
    name: "reducenulls",

    synonims: {
        "reduce": "reducenulls",
        "red": "reducenulls",
        "remove": "reducenulls"
    },

    "internal aliases":{
        "HasNull": "Has Null",
        "hasnull": "Has Null",
        "any": "Has Null",
        "AllNulls": "All Nulls",
        "allnulls": "All Nulls",
        "all": "All Nulls",
        "Rows": "Rows",
        "row": "Rows",
        "Columns": "Columns",
        "col": "Columns",
        "direction": "direction",
        "dir": "direction",
        "for": "direction"
    },

    defaultProperty: {
        "reducenulls": "direction",
        "reduce": "direction",
        "red": "direction",
        "remove": "direction"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new RedNImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;
        try {
            state.head = {
                data: this.reduce(table, params),
                type: "table"
            }
        } catch (e) {
            throw new RedNImplError(e.toString())
        }
        return state;
    },

    help: {
        synopsis: "Remove columns or rows with nulls from table",

        name: {
            "default": "reducenulls",
            synonims: ["reduce", "red", "remove"]
        },
        input:["table"],
        output:"table",
        "default param": "direction",
        params: [{
                name: "direction",
                synopsis: "Direction of iteration (optional))",
                type:["Rows", "row", "Columns", "col"],
                synonims: ["direction", "dir"],
                "default value": "Rows"
            }, {
                name: "mode",
                synopsis: "Condition for removes (optional))",
                type:["Has null", "has null", "any", "All Nulls", "all nulls", "all"],
                synonims: [],
                "default value": "Has null"
            }

        ],
        example: {
            description: "Remove nulls",
            code: "<?json\n    {\n  \"header\": [\n    {\n      \"metadata\": [\n        {\n          \"id\": \"0\",\n          \"label\": \"Col 0\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"1\",\n          \"label\": \"Col 1\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"2\",\n          \"label\": \"Col 2\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    }\n  ],\n  \"body\": [\n    {\n      \"metadata\": [\n        {\n          \"id\": \"0\",\n          \"label\": \"0\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        366.71,\n        928.25,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"1\",\n          \"label\": \"1\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        null,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"2\",\n          \"label\": \"2\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        923.05,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"3\",\n          \"label\": \"3\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        927.38,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"4\",\n          \"label\": \"4\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        368.6,\n        928.18,\n        null\n      ]\n    }\n  ]\n}\n?>\n\ntable()\n\nremove(dir:\"col\", mode:'all')\nremove(dir:'row', mode:'all')\n\nmerge(from:1, to:0)\n"

        }
    },

    reduce: function(table, params) {
        var reduce = (params) ? (params.reduce) ? params.reduce : params : {
            direction: "Rows",
            mode: "Has Null"
        }

        var direction = reduce.direction || "Rows"; // "Columns"
        var mode = reduce.mode || "Has Null"; // "All Nulls"


        var hasNull = function(data) {
            var result = false;
            data.forEach(function(item) {
                if (item == null || isNaN(new Number(item))) {
                    result = true;
                }
            });
            return result;
        };

        var allNulls = function(data) {
            var result = 0;
            data.forEach(function(item) {
                if (item == null || isNaN(new Number(item))) {
                    result++
                }
            });
            return result == data.length;
        }

        var criteria = (mode == "All Nulls") ? allNulls : hasNull;

        if (direction == "Rows") {
            for (var rowIndex = 0; rowIndex < table.body.length;) {
                if (criteria(table.body[rowIndex].value)) {
                    table.body.splice(rowIndex, 1);
                } else {
                    rowIndex++;
                }
            }

            return table;
        }

        if (direction == "Columns") {
            for (var columnIndex = 0; columnIndex < table.header.length;) {
                var data = table.body.map(function(currentRow) {
                    return currentRow.value[columnIndex];
                });
                if (criteria(data)) {
                    table.header.splice(columnIndex, 1);
                    table.body.forEach(function(currentRow) {
                        currentRow.value.splice(columnIndex, 1)
                    })
                } else {
                    columnIndex++;
                }
            }
            table.reduced = true;
            return table;
        }
    }
}
