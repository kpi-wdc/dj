
var CsvError = function(message) {
    this.message = message;
    this.name = "Command 'csv' implementation error";
}
CsvError.prototype = Object.create(Error.prototype);
CsvError.prototype.constructor = CsvError;

module.exports = {
    name: "csv",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "string") throw new CsvError("Incompatible context type: " + state.head.type+". Use context injection or 'str()' command to convert context to 'string' type")
        state.head.type = "csv";
        return state;
    },

    help: {
        synopsis: "Set 'csv' type for script context",

        name: {
            "default": "csv",
            synonims: []
        },
        input:["string"],
        output:"csv",
        "default param": "none",
        params: [],
        example: {
            description: "Set 'csv' type for script context",
            code: '<%xml <parent><child-list><child id="0"/><child id="1"/></child-list></parent> %>'
        }
    }
}
