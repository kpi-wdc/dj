// Generate Scatter Series

var line = require("./line").build;
var util = require("util");
var error = require("./chart-error");

module.exports = {
    name: "area",

    synonims: {},

    "internal aliases":{

        "axisX": "axisX",
        "axisx": "axisX",
        "xaxis": "axisX",
        "x": "axisX",

        "category": "category",
        "cat": "category",

        "index": "index",
        "yaxis": "index",
        "axisY": "index",
        "y": "index"

    },

    defaultProperty: {
        "area": "index"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw error.type("area", state.head.type)
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            axisX: params.axisX || 0,
            category: params.category,
            index: params.index || []
        } : {
            axisX: 0,
            index: []
        }


        if (params.axisX && !util.isNumber(params.axisX))
            throw error.value("area", "axisX", params.axisX)
        if (params.category && !util.isNumber(params.category))
            throw error.value("area", "category", params.category)

        if (params.index && !util.isArray(params.index))
            throw error.value("area", "index", params.index)

        try {
            state.head = {
                type: "area",
                data: line(table, params)
            }
        } catch (e) {
            throw error.general("area", e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Build area chart series",

        name: {
            "default": "area",
            synonims: []
        },
        input:["table"],
        output:"area",
        "default param": "index",
        params: [{
            name: "axisX",
            synopsis: "0-based index of x axis values (optional)",
            type:["number"],
            synonims: ["axisX", "xaxis", "x"],
            "default value": 0
        }, {
            name: "index",
            synopsis: "Array of 0-based indexes of y axis values (optional)",
            type:["array of numbers"],
            synonims: ["index", "axisY", "yaxis", "y"],
            "default value": []
        }, {
            name: "category",
            synopsis: "0-based index of categories (optional)",
            type:["number"],
            synonims: ["category", "cat"],
            "default value": "none"
        }],
        example: {
            description: "Build area chart series",
            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:'time', as:'row'},\r\n    {dim:'indicator', as:'col'}\r\n])\r\n\r\nnorm(for:'col', mode:'log')\r\nformat(3)\r\n\r\narea(x:-1)\r\n\r\ninfo()\r\nlog()\r\n"
        }
    }
}
