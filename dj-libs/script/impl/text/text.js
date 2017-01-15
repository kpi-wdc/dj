
var TextError = function(message) {
    this.message = message;
    this.name = "Command 'text' implementation error";
}
TextError.prototype = Object.create(Error.prototype);
TextError.prototype.constructor = TextError;

module.exports = {
    name: "text",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "string") throw new TextError("Incompatible context type: " + state.head.type+". Use context injection or 'str()' command to convert context to 'string' type")
        state.head.type = "string";
        return state;
    },

    help: {
        synopsis: "Set 'string' type for script context",

        name: {
            "default": "text",
            synonims: []
        },
        input:["string"],
        output:"string",
        "default param": "none",
        params: [],
        example: {
            description: "Set 'string' type for script context",
            code: "<%text version() %>"
        }
    }
}
