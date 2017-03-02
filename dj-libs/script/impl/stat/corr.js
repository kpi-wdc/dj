// returns correlation matrix

var transposeTable = require("../table/transpose").transpose,
    STAT = require("../lib/stat"),
    util = require("util");

var CorrImplError = function(message) {
    this.message = message;
    this.name = "Command 'correlation' implementation error";
}
CorrImplError.prototype = Object.create(Error.prototype);
CorrImplError.prototype.constructor = CorrImplError;



var impl = function(table, params) {

    var correlation = (params.correlation) ? params.correlation : params;

    if (correlation.direction == "Columns") table = transposeTable(table, { transpose: true });

    table.header = table.body.map(function(row) {
        return { metadata: row.metadata }
    });
    var values = [];
    for (var i = 0; i < table.body.length; i++) {
        var v = [];
        for (var j = 0; j < table.body.length; j++) {
            v.push(STAT.corr(table.body[i].value, table.body[j].value))
        }
        values.push(v);
    }
    table.body.forEach(function(row, index) {
        row.value = values[index]
    })

    return table;
}

module.exports = {
        name: "correlation",

        synonims: {
            "correlation": "correlation",
            "corr": "correlation"},
        
        "internal aliases":{
            "direction": "direction",
            "dir": "direction",
            "for": "direction",
            "Columns": "Columns",
            "col": "Columns",
            "Rows": "Rows",
            "row": "Rows"
        },

        defaultProperty: {
            "correlation": "direction",
            "corr": "direction",
        },

        execute: function(command, state, config) {
            if (state.head.type != "table")
                throw new CorrImplError("Incompatible context type: '" + state.head.type + "'.")
                        var table = state.head.data;
                        var params = command.settings;

                        params = (params) ? {
                            direction: params.direction || "Columns"
                        } : {
                            direction: "Columns"
                        }


                        if (params.direction != "Rows" && params.direction != "Columns")
                            throw new CorrImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")


                        try {
                            state.head = {
                                type: "table",
                                data: impl(table, params)
                            }
                        } catch (e) {
                            throw new CorrImplError(e.toString())
                        }
                        return state;
                    },

                    help: {
                        synopsis: "Build correlation matrix",

                        name: {
                            "default": "correlation",
                            synonims: ["correlation", "corr"]
                        },
                        input:["table"],
                        output:"table",
                        "default param": "direction",
                        params: [{
                            name: "direction",
                            synopsis: "Direction of iteration (optional)",
                            type:["Rows", "row", "Columns", "col"],
                            synonims: ["direction", "dir", "for"],
                            "default value": "Columns"
                        }],
                        example: {
                            description: "Build correlation matrix for columns",
                            code:   "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n  { dim:'time', as:'row'},\r\n  { dim:'indicator', as:'col'}\r\n])\r\n\r\ncorr(for:'col')\r\nformat(3)\r\n"
                        }
                    }
        }
