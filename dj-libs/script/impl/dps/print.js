
var DPSPrintError = function(message) {
    this.message = message;
    this.name = "Command 'print' implementation error";
}
DPSPrintError.prototype = Object.create(Error.prototype);
DPSPrintError.prototype.constructor = DPSPrintError;

module.exports = {
    name: "print",
    synonims: {
        "print": "print"
    },
    
    "internal aliases":{
        "script": "script"
    },

    defaultProperty: {
        "print": "script"
    },

    execute: function(command, state, config) {
        var script = (command.settings.script)
                        ? command.settings.script
                        : (state.head.type == "dps")
                            ? state.head.data
                            : state.instance._script;
        // if (state.head.type != "string") throw new DPSError("Incompatible context type: " + state.head.type+". Use context injection or 'str()' command to convert context to 'string' type")
        state.head.data = script;
        state.head.type = "dps";
        return state;
    },

    help: {
        synopsis: "Print script into context",

        name: {
            "default": "print",
            synonims: ["print"]
        },
        input:["any"],
        output:"json",
        "default param": "script",
        params: [],
        example: {
            description: "Set 'dps' type for script context",
            code: "<% version() %> dps()"
        }
    }
}
