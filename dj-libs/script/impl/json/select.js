var jp = require("jsonpath");

var SelectImplError = function(message) {
    this.message = message;
    this.name = "Command 'select' implementation error";
}
SelectImplError.prototype = Object.create(Error.prototype);
SelectImplError.prototype.constructor = SelectImplError;


module.exports = {
    name: "select",
    synonims: {
        "select": "select"
    },

    "internal aliases":{
        "path": "path",
        "p": "path"
    },

    defaultProperty: {
        "select": "path"
    },

    execute: function(command, state, config) {

        command.settings.path = (command.settings.path) ? command.settings.path : "";
        if (command.settings.path == "") return state;
        if (state.head.type != "json") throw new SelectImplError("Incompatible context type: '" + state.head.type + "'.\nUse 'json()' command for convert context to 'json' type")
        try {
            state.head = {
                data: jp.query(state.head.data, command.settings.path),
                type: "json"
            }
            return state;
        } catch (e) {
            throw new SelectImplError(e.toString())
        }
    },

    help: {
        synopsis: "Select object via json path",

        name: {
            "default": "select",
            synonims: ["select"]
        },
        input:["json"],
        output:"json",
        "default param": "path",
        params: [{
            name: "path",
            synopsis: "Json path to selected value (optional). if path is not assigned then input context will be selected.",
            synonims: ["p", "path"],
            "default value": "empty"
        }],
        example: {
            description: "Select various items of array [1,2,3]",
            code:   "<?json\n    [1,2,3]\n?>\n\nset('a')\nselect('$[0]')\ninfo()\nget('a')\nselect('$[?(@>1)]')\ninfo()\nlog()\n"
        }
    }
}
