// Generate Bar Series
var bar = require("./bar").build;
var error = require("./chart-error");

module.exports = {
    name: "hbar",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table") throw error.type('hbar', state.head.type)
        var table = state.head.data;
        var params = {}
        try {
            state.head = {
                data: bar(table, params),
                type: "hbar"
            }
        } catch (e) {
            throw error.general("hbar", e.toString())
        }

        return state;
    },
    help: {
        synopsis: "Build horizontal bar chart serie",

        name: {
            "default": "hbar",
            synonims: []
        },
        input:["table"],
        output:"hbar",
        "default param": "none",
        params: [],
        example: {
            description: "Build horizontal bar chart serie",
            code: "load(\r\n    dataset:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\norder(by:-1, as:\"az\")\r\nlimit(s:1,l:3)\r\nhbar()\r\n"
        
        }
    }
}
