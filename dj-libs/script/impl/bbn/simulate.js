var SimulateImplError = function(message) {
    this.message = message;
    this.name = "Command 'simulate' implementation error";
}
SimulateImplError.prototype = Object.create(Error.prototype);
SimulateImplError.prototype.constructor = SimulateImplError;

// because of saving in storage
var initParents = function(bbn) {
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
        if (!command.settings.simulator && state.head.type != "bbn-simulator")
            throw new SimulateImplError("Incompatible context type: '" + state.head.type + "'.");
        var simulator = command.settings.simulator || state.head.data;
        var bbn = simulator.bbn;
        initParents(bbn);
        var evidences = command.settings.evidences;
        try {           
            for (var nodeName in evidences) {
                bbn.observe(nodeName, evidences[nodeName]);
            }
            bbn.sample(10000);
            var conclusions = {};
            bbn.nodes.forEach(function(node) {
                var probs = node.probs();
                var conclusion = {};
                node.values.forEach(function(value, index) {
                    conclusion[value] = probs[index];
                });
                conclusions[node.name] = conclusion;
            });
            state.head = {
                data: conclusions,
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