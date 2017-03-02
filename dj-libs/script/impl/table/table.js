var TableImplError = function(message) {
    this.message = message;
    this.name = "Command 'table' implementation error";
}
TableImplError.prototype = Object.create(Error.prototype);
TableImplError.prototype.constructor = TableImplError;



module.exports = {
    name: "table",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "json")
            throw new TableImplError("Incompatible context type: '" + state.head.type + "'.")
        state.head.type = "table";
        return state;
    },

    help: {
        synopsis: "Set 'table' type for script context",

        name: {
            "default": "table",
            synonims: []
        },
        input:["json"],
        output:"table",
        "default param": "none",
        params: [],
        example: {
            description: "Get cached data and process it as table",
            code: "<?json\n    {\n  \"header\": [\n    {\n      \"metadata\": [\n        {\n          \"id\": \"0\",\n          \"label\": \"Col 0\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"1\",\n          \"label\": \"Col 1\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"2\",\n          \"label\": \"Col 2\",\n          \"dimension\": \"Columns\",\n          \"dimensionLabel\": \"Columns\",\n          \"role\": \"metric\"\n        }\n      ]\n    }\n  ],\n  \"body\": [\n    {\n      \"metadata\": [\n        {\n          \"id\": \"0\",\n          \"label\": \"0\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        366.71,\n        928.25,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"1\",\n          \"label\": \"1\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        null,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"2\",\n          \"label\": \"2\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        923.05,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"3\",\n          \"label\": \"3\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        null,\n        927.38,\n        null\n      ]\n    },\n    {\n      \"metadata\": [\n        {\n          \"id\": \"4\",\n          \"label\": \"4\",\n          \"dimension\": \"Rows\",\n          \"dimensionLabel\": \"Rows\",\n          \"role\": \"metric\"\n        }\n      ],\n      \"value\": [\n        368.6,\n        928.18,\n        null\n      ]\n    }\n  ]\n}\n?>\n\ntable()\n\nremove(dir:\"col\", mode:'all')\nremove(dir:'row', mode:'all')\n\nmerge(from:1, to:0)\n"
        }
    }
}
