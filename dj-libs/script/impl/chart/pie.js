// Generate Bar Series
var bar = require("./bar").build;
var error = require("./chart-error");

module.exports = {
    name: "pie",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table") throw error.type("pie", state.head.type)
        var table = state.head.data;
        var params = {}
        try {
            state.head = {
                data: bar(table, params),
                type: "pie"
            }
        } catch (e) {
            throw error.general('pie', e.toString())
        }

        return state;
    },
    help: {
        synopsis: "Build pie chart serie",

        name: {
            "default": "pie",
            synonims: []
        },
        input:["table"],
        output:"pie",
        "default param": "none",
        params: [],
        example: {
            description: "Build pie chart serie",
            code:  "load(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\n\r\nnorm(for:'row',method:'log')\r\nformat(1)\r\norder(by:-1, as:\"az\")\r\nlimit()\r\n\r\npie()\r\n"

        }
    }
}
