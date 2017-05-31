var SituationImplError = function(message) {
    this.message = message;
    this.name = "Command 'situation' implementation error";
}
SituationImplError.prototype = Object.create(Error.prototype);
SituationImplError.prototype.constructor = SituationImplError;

// because of saving in storage
var restoreRefs = function(simulator) {
    var bbn = simulator.bbn;
    bbn.nodeMap = undefined;
    bbn.nodes.forEach(function(node) {
        if (!node.parents) {
            node.parents = [];
        }
        var parents = [];
        node.parents.forEach(function(parent) {
            parents.push(bbn.node(parent.name));
        });
        node.parents = parents;
    });
}

module.exports = {
    name: "situation",
    synonims:{
    },
    "internal aliases": {
        "evids": "evidences",
        "sim" : "simulator",
        "t1" : "fromT",
        "t2" : "toT"
    },

    defaultProperty:{
    },

    execute: function(command, state) {
        if (!command.settings.simulator && state.head.type != "bbn-simulator")
            throw new SituationImplError("Incompatible context type: '" + state.head.type + "'.");

        var simulator = command.settings.simulator || state.head.data;
        restoreRefs(simulator);
        var evidences = command.settings.evidences;
        var fromT = command.settings.fromT;
        var toT = command.settings.toT;
        try {           
            state.head = {
                data: simulator.getSituationData(evidences, fromT, toT),
                // have to fix to right type
                type: "situation-data"
            }
        } catch (e) {
            throw new SituationImplError(e.toString());
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