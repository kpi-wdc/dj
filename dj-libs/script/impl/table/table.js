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
            code: "src(cache:'5855481930d9ae60277a474a')\njson()\n//cast to table type\ntable()\norder(for:'row',by:-1, as:'az')\njson()"
        }
    }
}
