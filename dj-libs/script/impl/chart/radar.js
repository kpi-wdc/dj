// Generate Bar Series
var bar = require("./bar").build;
var error = require("./chart-error");

module.exports = {
    name: "radar",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table") throw error.type('radar', state.head.type)
        var table = state.head.data;
        var params = {}
        try {
            state.head = {
                data: bar(table, params),
                type: "radar"
            }
        } catch (e) {
            throw error.general("radar", e.toString())
        }

        return state;
    },
    help: {
        synopsis: "Build radar chart serie",

        name: {
            "default": "radar",
            synonims: []
        },
        input:["table"],
        output:"radar",
        "default param": "none",
        params: [],
        example: {
            description: "Build radar chart serie",
            code:   'src(ds:"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02")\n'+
                    'json()\n'+
                    'dataset()\n'+
                    'proj([{dim:"time", as:"row"},{dim:"indicator",as:"col"}])\n'+
                    'order(by:-1, as:"az")\n'+
                    'limit(s:1,l:3)\n'+
                    'radar()'
        }
    }
}
