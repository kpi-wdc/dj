// Generate Scatter Series


var ReduceNull = require("../table/reduce-nulls").reduce,
    transposeTable = require("../table/transpose").transpose,
    util = require("util");
var error = require("./chart-error");

var impl = function(table, params) {


    var axisXIndex = params.axisX || 0;
    var xValues = [];
    var categories = [];
    var base, role, format;
    var result = [];

    // if (!params.index) return {};
    // if (params.index.length == 0) return {};


    table = ReduceNull(table, {
        reduce: {
            enable: true,
            direction: "Rows",
            mode: "Has Null"
        }
    })

    table = transposeTable(table);


    if (params.index.length == 0) {
        table.body.forEach(function(item, index) {
            params.index.push(index)
        })
    }

    if (params.category >= 0) {
        categories = table.body[params.category].value.map(function(item) {
            return item
        })
    }

    if (params.category < 0) {
        categories = table.header.map(function(row) {
            return row.metadata[-params.category - 1].label
        });
    }

    var cats = categories

    var catList = [];
    cats.forEach(function(cat) {
        if (catList.indexOf(cat) < 0) catList.push(cat)
    })


    // console.log("axisXIndex",axisXIndex);
    // console.log("HEADER")
    // table.header.forEach(function (item,index){console.log(index, item.metadata)})
    // console.log("BODY")
    // table.body.forEach(function (item,index){console.log(index, item.metadata)})


    if (axisXIndex >= 0) {
        xValues = table.body[axisXIndex].value.map(function(item) {
            return item
        });
        base = table.body[axisXIndex].metadata.map(function(item) {
            return item.label
        }).join(", ");
        role = table.body[axisXIndex].metadata
            .filter(function(item) {
                return item.role
            })
            .map(function(item) {
                return item.role
            })[0];
    } else {
        xValues = table.header.map(function(row) {
            return row.metadata[-axisXIndex - 1].label
        });
        base = table.header[0].metadata[-axisXIndex - 1].dimensionLabel;
        role = table.header[0].metadata[-axisXIndex - 1].role
    }

    if (catList.length == 0) {
        catList = [0];
        categories = [];
        table.body[0].value.forEach(function(item) {
            categories.push(0)
        })
    }

    var $axisX = {
        label: base,
        role: role, //table.header[0].metadata[0].role,
        format: table.header[0].metadata[0].format
    }


    table.body.forEach(function(row, index) {
        if (params.index.indexOf(index) >= 0) {

            catList.forEach(function(cat, catIndex) {
                result.push({
                    "category": cat,
                    "key": ((params.category) ? ("Category: " + cat + ", ") : "") + row.metadata.map(function(item) {
                        return item.label
                    }).join(", "),
                    "base": base,
                    "axisX": $axisX,
                    // {
                    //   role: table.header[0].metadata[0].role,
                    //   format:table.header[0].metadata[0].format
                    // },
                    "values": row.value.map(function(item, j) {
                        return {
                            "category": categories[j],
                            "x": xValues[j],
                            "y": item,
                            "label": row.metadata.map(function(item) {
                                return item.label
                            }).concat(
                                table.header[j].metadata.map(function(item) {
                                    return item.label
                                })).join(", ")
                        }
                    })
                })
            })
        }
    })

    result.forEach(function(serie) {
        serie.values = serie.values.filter(function(item) {
            return item.category == serie.category
        })
    })

    return result;
}


module.exports = {
    name: "scatter",

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
        "scatter": "index"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw error.type("scatter", state.head.type)
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
            throw error.value("scatter", "axisX", params.axisX)
        if (params.category && !util.isNumber(params.category))
            throw error.value('scatter', "category", params.category)
        if (params.index && !util.isArray(params.index))
            throw error.value('scatter', "index", params.index)

        try {
            state.head = {
                type: "scatter",
                data: impl(table, params)
            }
        } catch (e) {
            throw error.general(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Build scatter chart series",

        name: {
            "default": "scatter",
            synonims: []
        },
        input:["table"],
        output:"scatter",
        "default param": "index",
        params: [{
            name: "axisX",
            synopsis: "0-based index of x axis values (optional)",
            type:["number"],
            synonims: ["axisX", "xaxis", "x", "axisx"],
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
            description: "Build scatter chart series",
            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:\"dataset\")\r\n    \r\nproj([\r\n    { dim:'time', as:'row'},\r\n    { dim:'indicator', as:'col'}\r\n])\r\n\r\nnorm(for:'col', mode:'log')\r\nformat(3)\r\n\r\nscatter(x:-1)\r\n"
        }
    }
}
