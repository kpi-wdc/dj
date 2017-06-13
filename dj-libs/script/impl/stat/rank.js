// Add rank into table

var STAT = require("../lib/stat"),
    transposeTable = require("../table/transpose").transpose,
    util = require("util");


var RankImplError = function(message) {
    this.message = message;
    this.name = "Command 'rank' implementation error";
}
RankImplError.prototype = Object.create(Error.prototype);
RankImplError.prototype.constructor = RankImplError;


var impl = function(table, params) {
    // if(!params.rank) return table;
    // if(!params.rank.enable) return table;

    var rank = (params.rank) ? params.rank : params;
    if (rank.direction == "Columns") table = transposeTable(table, { transpose: true });

    if (rank.indexes.length == 0) {
        table.body.forEach(function(row, index) {
            rank.indexes.push(index);
        })
    }

    var b = [];



    table.body.forEach(function(row, index) {

        var foundedIndex = (function(num, list) {
            return list.filter(function(item) {
                return item == num
            })[0]
        })(index, rank.indexes)

        if (foundedIndex >= 0) {
            var rankList = STAT.rank(row.value);
            if (rank.asc == "Z-A") {
                var max = STAT.max(rankList);
                rankList = rankList.map(function(item) {
                    return max + 1 - item
                })
            }
            var rankRow = {
                metadata: row.metadata.map(function(item) {
                    return item
                }),
                value: rankList
            }

            rankRow.metadata.push({
                dimension: "type",
                dimensionLabel: "Type",
                id: "rank",
                label: "Rank"
            })
            b.push(rankRow)
        }
        row.metadata.push({
            dimension: "type",
            dimensionLabel: "Type",
            id: "value",
            label: "Value"
        })
        b.push(row);

    })


    table.body = b;

    if (rank.direction == "Columns") table = transposeTable(table, { transpose: true });
    return table;
}

module.exports = {
    name: "rank",

    synonims: {},

    "internal aliases":{
        "direction": "direction",
        "dir": "direction",
        "for": "direction",
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",
        "indexes": "indexes",
        "items": "indexes",

        "as": "asc",
        "order": "asc",

        "A-Z": "A-Z",
        "az": "A-Z",
        "direct`": "A-Z",
        "Z-A": "Z-A",
        "za": "Z-A",
        "inverse": "Z-A"
    },

    defaultProperty: {
        "rank": "indexes",
        "rank": "indexes"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new RankImplError("Incompatible context type:'" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Rows",
            asc: params.asc || "A-Z",
            indexes: params.indexes || []
        } : {
            direction: "Columns",
            asc: "A-Z",
            indexes: []
        }


        if (params.direction != "Rows" && params.direction != "Columns")
            throw new RankImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        if (!util.isArray(params.indexes))
            throw new RankImplError("Incompatible indexes value: " + JSON.stringify(params.indexes) + ".")

        if (params.asc != "A-Z" && params.asc != "Z-A")
            throw new RankImplError("Incompatible asc value: " + JSON.stringify(params.asc) + ".")


        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new RankImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Add rank",

        name: {
            "default": "rank",
            synonims: []
        },
        input:["table"],
        output:"table",
        "default param": "indexes",
        params: [{
            name: "direction",
            synopsis: "Direction of iteration (optional)",
            type:["Rows", "row", "Columns", "col"],
            synonims: ["direction", "dir", "for"],
            "default value": "Columns"
        }, {
            name: "indexes",
            synopsis: "Array of 0-based indexes of items that will be ranked (optional)",
            type:["array of numbers"],
            synonims: ["indexes", "items"],
            "default value": []
        }, {
            name: "asc",
            synopsis: "Define order (optional)",
            type:["A-Z", "az", "direct", "Z-A", "za", "inverse"],
            synonims: ["order", "as"],
            "default value": "A-Z"
        }],
        example: {
            description: "Rank first column values",
            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:\"dataset\"\r\n)\r\nproj([\r\n  { dim:'time', role:'row', items:[] },\r\n  { dim:'indicator', role:'col', items:[] }\r\n])\r\n\r\nrank(for:\"col\",items:[0],as:\"az\")\r\n\r\norder(by:0, as:\"az\")\r\n\r\n"
        }
    }
}
