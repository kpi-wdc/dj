// return PCA results
// 
var transposeTable = require("../table/transpose").transpose,
    PCA = require("../lib/pca").PCA,
    ReduceNull = require("../table/reduce-nulls").reduce,
    util = require("util");

var PcaImplError = function(message) {
    this.message = message;
    this.name = "Command 'pca' implementation error";
}
PcaImplError.prototype = Object.create(Error.prototype);
PcaImplError.prototype.constructor = PcaImplError;

var impl = function(table, params) {
    // if(!params.pca) return table;
    // if(!params.pca.enable) return table;
    var pca = (params.pca) ? params.pca : params;
    if (pca.direction == "Columns") table = transposeTable(table);

    var result = {
        header: [],
        body: [],
        metadata: table.metadata
    }

    table = ReduceNull(table, {
        reduce: {
            enable: true,
            direction: "Rows",
            mode: "Has Null"
        }
    });



    if (table.body.length < table.header.length) return result;

    var data = PCA(table);

    if (pca.result == "Scores") {
        var values = data.scores;
        result.header = values[0].map(function(item, index) {
            return {
                metadata: [{
                    dimension: "pc",
                    dimensionLabel: "Principal Component",
                    id: "index",
                    label: ("PC" + (index + 1))
                }]
            }
        })
        table.body.forEach(function(row, index) {
            result.body.push({
                metadata: row.metadata.map(function(item) {
                        return item
                    })
                    .concat({
                        dimension: "type",
                        dimensionLabel: "Type",
                        id: "o",
                        label: "Object"
                    }),
                value: values[index].map(function(item) {
                    return item
                })
            })
        })

        if (pca.direction == "Columns") result = transposeTable(result);
        return result;
    }

    if (pca.result == "Eigen Values") {
        var values = data.eigenValues;

        result.header = values[0].map(function(item, index) {
            return {
                metadata: [{
                    dimension: "ev",
                    dimensionLabel: "Value",
                    id: "index",
                    label: ("EV" + (index + 1))
                }]
            }
        })

        result.body.push({
            metadata: [{
                dimension: "evs",
                dimensionLabel: "Eigen Values",
                id: "evs",
                label: "Eigen Values"
            }],
            value: values.map(function(row, index) {
                return row[index]
            })
        })
        return result;
    }

    if (pca.result == "loadings") {
        var values = data.loadings;
        result.header = values[0].map(function(item, index) {
            return {
                metadata: [{
                    dimension: "pc",
                    dimensionLabel: "Principal Component",
                    id: "index",
                    label: ("PC" + (index + 1))
                }]
            }
        })
        result.body = values.map(function(r, index) {
            return {
                metadata: table.header[index].metadata,
                value: r
            }
        })
        return result;
    }

}

module.exports = {
    name: "pca",

    synonims: {},

    "internal aliases":{
        "direction": "direction",
        "dir": "direction",
        "for": "direction",
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",

        "result": "result",
        "return": "result",

        "Scores": "Scores",
        "scores": "Scores",

        "EigenValues": "Eigen Values",
        "eigenvalues": "Eigen Values",
        "ev": "Eigen Values",

        "loadings": "loadings",
        "Loadings": "loadings"
    },

    defaultProperty: {
        "pca": "direction"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new PcaImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Rows",
            result: params.result || "Scores"
        } : {
            direction: "Rows",
            result: "Scores"
        }


        if (params.direction != "Rows" && params.direction != "Columns")
            throw new PcaImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        if (params.result != "Scores" && params.result != "Eigen Values" && params.result != "loadings")
            throw new PcaImplError("Incompatible result value: " + JSON.stringify(params.result) + ".")

        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new PcaImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Build Principal Compoment Analysis Results",

        name: {
            "default": "pca",
            synonims: []
        },
        input:["table"],
        output:["table"],
        "default param": "direction",
        params: [{
            name: "direction",
            synopsis: "Directionof iteration  (optional)",
            type:["Rows", "row", "Columns", "col"],
            synonims: ["direction", "dir", "for"],
            "default value": "Rows"
        }, {
            name: "result",
            synopsis: "Result type (optional)",
            type:["Scores", "scores", "Eigen Values", "eigen values", "ev", "Loadings", "loadings"],
            synonims: ["result", "return"],
            "default value": "Scores"
        }],
        example: {
            description: "Build all PCA results",
            code:  "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:\"dataset\"\r\n)\r\nproj([\r\n  { dim:'time', role:'row', items:[] },\r\n  { dim:'indicator', role:'col', items:[] }\r\n])\r\nset('t')\r\npca(for:'row',return:'scores')\r\ninfo()\r\n\r\nget(var:'t', as:'table')\r\npca(for:'row',return:'ev')\r\ninfo()\r\n\r\nget(var:'t', as:'table')\r\npca(for:'row',return:'loadings')\r\ninfo()\r\n\r\nlog()\r\n"
        }
    }
}
