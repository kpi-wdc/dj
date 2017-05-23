var SimulateImplError = function(message) {
    this.message = message;
    this.name = "Command 'simulate' implementation error";
}
SimulateImplError.prototype = Object.create(Error.prototype);
SimulateImplError.prototype.constructor = SimulateImplError;

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
    name: "simulate",
    synonims:{
        "propagate":"simulate"
    },
    "internal aliases": {
        "evids": "evidences",
        "sim" : "simulator"
    },

    defaultProperty:{
        "simulate" : "evidences",
        "propagate": "evidences"
    },

    execute: function(command, state) {
        if (!command.settings.simulator && state.head.type != "bbn-simulator" ||
                !command.settings.evidences && state.head.type != "bbn-evidences")
            throw new SimulateImplError("Incompatible context type: '" + state.head.type + "'.");

        var simulator = command.settings.simulator || state.head.data;
        restoreRefs(simulator);
        var evidences = command.settings.evidences || state.head.data;
        try {           
            state.head = {
                data: simulator.getConclusions(evidences),
                type: "bbn-conclusions"
            }
        } catch (e) {
            throw new SimulateImplError(e.toString());
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