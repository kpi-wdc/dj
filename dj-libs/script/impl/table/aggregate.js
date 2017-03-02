// aggregate table


var STAT = require("../lib/stat"),
    transposeTable = require("./transpose").transpose,
    util = require("util");


var AggImplError = function(message) {
    this.message = message;
    this.name = "Command 'aggregate' implementation error";
}
AggImplError.prototype = Object.create(Error.prototype);
AggImplError.prototype.constructor = AggImplError;



var impl = function(table, params) {

    //  aggregation:{
    //      enable:true,
    //      direction:"Rows",
    //      data:["max","min","avg","std","sum"]
    //  }



    // if(!params.aggregation) return table;
    // if(!params.aggregation.enable) return table;

    var aggregation = (params.aggregation) ? params.aggregation : params;
    aggregation.data = ((aggregation.data) ? ((aggregation.data.forEach) ? aggregation.data : [aggregation.data]) : ["sum"]).map(function(item) {
        return (item == "Standartization") ? "std" : item
    })


    if (aggregation.direction == "Columns") table = transposeTable(table, { transpose: true });

    aggregation.data
        .forEach(function(item) {
            var hmetaTemplate = table.header[0].metadata
                .map(function(m, index) {
                    return {
                        dimension: m.dimension,
                        dimensionLabel: m.dimensionLabel,
                        id: "",
                        label: ""
                    }
                });
            var lastMeta = hmetaTemplate[hmetaTemplate.length - 1];
            lastMeta.id = (util.isFunction(item)) ? "custom" : item;
            lastMeta.label = lastMeta.id;
            table.header.push({ metadata: hmetaTemplate });
        })

    table.body
        .forEach(function(row) {
            var v = row.value;
            var additional = [];
            aggregation.data
                .forEach(function(item) {
                    if (item == "min") {
                        additional.push(STAT.min(v))
                    }
                    if (item == "max") {
                        additional.push(STAT.max(v))
                    }
                    if (item == "mean") {
                        additional.push(STAT.mean(v))
                    }
                    if (item == "std") {
                        additional.push(STAT.std(v))
                    }
                    if (item == "stdr") {
                        additional.push(STAT.std(v) / STAT.mean(v))
                    }
                    if (item == "sum") {
                        additional.push(STAT.sum(v))
                    }
                    if (item == "range") {
                        additional.push(STAT.range(v))
                    }
                    if (item == "median") {
                        additional.push(STAT.median(v))
                    }
                    if (item == "count") {
                        additional.push(v.filter(function(val) {
                            return val
                        }).length)
                    }
                    if (util.isFunction(item)) {
                        additional.push(item(v))
                    }
                })
            row.value = row.value.concat(additional);
        })


    if (aggregation.direction == "Columns") table = transposeTable(table, { transpose: true });

    return table;
}

module.exports = {
    name: "aggregate",

    synonims: {
        "aggregate": "aggregate",
        "agg": "aggregate"
    },

    "internal aliases":{

        "direction": "direction",
        "dir": "direction",
        "for": "direction",
        
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",

        "data": "data",
        "add": "data"

    },

    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new AggImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Rows",
            data: params.data || []
        } : {
            direction: "Rows",
            data: []
        }


        if (!util.isArray(params.data))
            throw new AggImplError("Incompatible data value: " + JSON.stringify(params.data) + ".")


        if (params.direction != "Rows" && params.direction != "Columns")
            throw new AggImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new AggImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Add aggregations to table",

        name: {
            "default": "aggregation",
            synonims: ["aggregation", "agg"]
        },
        input:["table"],
        output:"table",
        "default param": "data",
        params: [{
            name: "direction",
            synopsis: "Direction of iteration (optional)",
            type:["Rows", "row", "Columns", "col"],
            synonims: ["direction", "dir"],
            "default value": "Columns"
        }, {
            name: "data",
            synopsis: "Array of aggregate functions (optional)",
            type:["min", "max", "avg", "std", "stdr", "sum", "range", "median", "count","javascript callback via bindable"],
            synonims: ["data", "add"],
            "default value": ['sum']
        }],
        example: {
            description: "Add column with count of nulls for each row",
            code:   "<?javascript\r\n    var nullCount = function(values){\r\n      return values.filter(function(d){\r\n          return d == null\r\n          \r\n      }).length\r\n    };\r\n?>\r\n\r\nset(\"f\")\r\n\r\nimport(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\n\r\nagg(for:\"row\",add:[{{f.nullCount}}])\r\n\r\ninfo()\r\nlog()"
        }
    }
}
