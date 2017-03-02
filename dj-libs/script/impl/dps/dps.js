
var DPSError = function(message) {
    this.message = message;
    this.name = "Command 'dps' implementation error";
}
DPSError.prototype = Object.create(Error.prototype);
DPSError.prototype.constructor = DPSError;

module.exports = {
    name: "dps",
    synonims: {
        "dps": "dps"
    },
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "string") throw new DPSError("Incompatible context type: " + state.head.type+". Use context injection or 'str()' command to convert context to 'string' type\nState: "+JSON.stringify(state.head))
        state.head.type = "dps";
        return state;
    },

    help: {
        synopsis: "Set 'dps' type for script context",

        name: {
            "default": "dps",
            synonims: []
        },
        input:["string"],
        output:"dps",
        "default param": "none",
        params: [],
        example: {
            description: "Set 'dps' type for script context",
            code: "<?dps\n    version() \n?> \n\nset('getVersion')\n\nrun({{getVersion}})\n"
        }
    }
}
