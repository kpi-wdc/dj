//generate dependencies serie
//
//
var error = require("./chart-error");

var impl = function(table, params) {
    return table.body.map(function(row) {
        var serie = {
            key: row.metadata.map(function(item) {
                return item.label }).join(", "),
            values: row.value.map(function(item, index) {
                return {
                    label: table.header[index].metadata.map(function(item) {
                        return item.label
                    }).join(", "),
                    value: item
                }
            })
        }
        return serie;
    })
}

module.exports = {
    name: "deps",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table") throw error.type("deps", state.head.type)
        var table = state.head.data;
        var params = {}
        try {
            state.head = {
                data: impl(table, params),
                type: "deps"
            }
        } catch (e) {
            throw error.general("deps", e.toString())
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
