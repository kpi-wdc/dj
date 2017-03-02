// clusterize rows(colunms)
// 

var transposeTable = require("../table/transpose").transpose,
    CLUSTER = require("../lib/cluster").CLUSTER,
    util = require("util");

var ClsImplError = function(message) {
    this.message = message;
    this.name = "Command 'cluster' implementation error";
}
ClsImplError.prototype = Object.create(Error.prototype);
ClsImplError.prototype.constructor = ClsImplError;


var impl = function(table, params) {
    // if(!params.cluster) return table;
    // if(!params.cluster.enable) return table;

    var cluster = (params.cluster) ? params.cluster : params;

    if (cluster.direction == "Columns") table = transposeTable(table, { transpose: true });

    var clusterList = CLUSTER.kmeans(
        cluster.count,
        table.body.map(function(row) {
            return row.value
        })
    );

    table = transposeTable(table, { transpose: true });
    table.body.push({
        metadata: table.body[0].metadata.map(function(item) {
            return {
                dimension: item.dimension,
                dimensionLabel: item.dimensionLabel,
                id: item.id,
                label: item.label
            }
        }),
        value: clusterList.assignments.map(function(item) {
            return item + 1
        })
    })
    table.body[table.body.length - 1].metadata.forEach(function(item, index) {
        if (index < table.body[table.body.length - 1].metadata.length - 1) {
            item.id = "";
            item.label = "";
        } else {
            item.id = "cls";
            item.label = "Cluster Index";
        }
    })
    table = transposeTable(table, { transpose: true });


    if (cluster.direction == "Columns") table = transposeTable(table, { transpose: true });
    return table;

}
module.exports = {
    name: "cluster",

    synonims: {
        "cluster": "cluster",
        "cls": "cluster"
    },
    
    "internal aliases":{
        "direction": "direction",
        "dir": "direction",
        "for": "direction",
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",
        "count": "count"
    },

    defaultProperty: {
        "cluster": "count",
        "cls": "count"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new ClsImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Rows",
            count: params.count || 2
        } : {
            direction: "Rows",
            count: 2
        }


        if (params.direction != "Rows" && params.direction != "Columns")
            throw new ClsImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        if (!util.isNumber(params.count))
            throw new ClsImplError("Incompatible count value: " + JSON.stringify(params.count) + ".")


        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new ClsImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Build clusters",

        name: {
            "default": "cluster",
            synonims: ["cluster", "cls"]
        },
        input:["table"],
        output:"table",
        "default param": "count",
        params: [{
            name: "direction",
            synopsis: "Direction of iteration (optional)",
            type:["Rows", "row", "Columns", "col"],
            synonims: ["direction", "dir", "for"],
            "default value": "Columns"
        }, {
            name: "count",
            synopsis: "Count of clusters (optional)",
            type:["number"],
            synonims: [],
            "default value": 2
        }],
        example: {
            description: "Build clusters for row",
            code:   "load(\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\n    as:'dataset'\n)\n\nquery([\n    {dim:'time', as:'row'},\n    {dim:'indicator', as:'col'}\n])\n\nnorm(for:'col', mode:'log')\ncls(for:'row',count:2)\nformat(3)\n"
        }
    }
}
