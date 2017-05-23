var EvidencesImplError = function(message) {
    this.message = message;
    this.name = "Command 'evidences' implementation error";
}
EvidencesImplError.prototype = Object.create(Error.prototype);
EvidencesImplError.prototype.constructor = EvidencesImplError;


module.exports = {
    name: "evidences",
    synonims:{
        "evids":"evidences"
    },
    "internal aliases": {
        "t": "time",
        "sim" : "simulator"
    },

    defaultProperty:{
        "evidences" : "time",
        "evids": "time"
    },

    execute: function(command, state) {
        if (!command.settings.simulator && state.head.type != "bbn-simulator")
            throw new EvidencesImplError("Incompatible context type: '" + state.head.type + "'.");
        var simulator = command.settings.simulator || state.head.data;
        var time = command.settings.time;
        try {           
            state.head = {
                data: simulator.getEvidences(time),
                type: "bbn-evidences"
            }
        } catch (e) {
            throw new EvidencesImplError(e.toString());
        }

        return state;
    },
    help: {
        synopsis: "Build dependency wheel chart serie",

        name: {
            "default": "deps",
            synonims: []
        },
        input:["table (shuld be correlation matrix)"],
        output:"deps",
        "default param": "none",
        params: [],
        example: {
            description: "Build dependency wheel chart serie",
            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:'time', as:'row'},\r\n    {dim:'indicator', as:'col'}\r\n])\r\n\r\ncorr(for:'col')\r\ndeps()\r\n"
        }
    }
}