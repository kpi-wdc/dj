// Generate Bar Series
// 
var error = require("./chart-error");

var impl = function(table, params) {

    var result = [];
    table.body.forEach(function(serieData) {
        var currentSerie = {
            key: serieData.metadata[0].label,
            role: serieData.metadata[0].role,
            format: serieData.metadata[0].format,
            label: {
                role: table.header[0].metadata[0].role,
                format: table.header[0].metadata[0].format
            },
            values: []
        }
        table.header.forEach(function(currentColumn, index) {
            currentSerie.values.push({
                label: currentColumn.metadata[0].label,
                value: serieData.value[index]
            })
        })
        result.push(currentSerie)
    })

    return result;
}

module.exports = {
    name: "bar",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table") throw error.type("bar", state.head.type)
        var table = state.head.data;
        var params = {}
        try {
            state.head = {
                data: impl(table, params),
                type: "bar"
            }
        } catch (e) {
            throw error.general("bar", e.toString())
        }

        return state;
    },
    help: {
        synopsis: "Build bar chart serie",

        name: {
            "default": "bar",
            synonims: []
        },
        input:["table"],
        output:"bar",
        "default param": "none",
        params: [],
        example: {
            description: "Build bar chart serie",
            code: "load(\r\n    dataset:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\norder(by:-1, as:\"az\")\r\nlimit(s:1,l:3)\r\nbar()\r\n"
        }
    },
    build: function(table, params) {
        return impl(table, params)
    }
}
