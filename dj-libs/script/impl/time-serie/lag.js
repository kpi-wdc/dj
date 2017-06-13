// lag time serie


var STAT = require("../lib/stat"),
    transposeTable = require("../table/transpose").transpose,
    util = require("util");
    _ = require("lodash-node");


var LagImplError = function(message) {
    this.message = message;
    this.name = "Command 'lag' implementation error";
}
LagImplError.prototype = Object.create(Error.prototype);
LagImplError.prototype.constructor = LagImplError;



var impl = function(table, params) {
    
    var lag = (params.lag) ? params.lag : params;
    
    if (lag.direction == "Columns") table = transposeTable(table, { transpose: true });
    
    lag.interval = lag.interval || 0;
    
    lag.indexes = lag.indexes || [];
    
    if(lag.indexes.length == 0){
        lag.indexes = _.range(table.body.length)
    }

    lag.indexes.forEach(function(index){
        var l = table.body[index].value.length;
        var lv = null;//_.first(table.body[index].value);
        var rv = null;//_.last(table.body[index].value);
        if( lag.interval > 0 ){
            table.body[index].value = _.take( _.fill(Array(lag.interval), lv).concat(table.body[index].value),l)
        }else{
            if( lag.interval < 0 ){
                table.body[index].value = _.takeRight( table.body[index].value.concat(_.fill(Array(-lag.interval), rv)),l)
            }
        }
    })

    if (lag.direction == "Columns") table = transposeTable(table, { transpose: true });

    return table;
}

module.exports = {
    name: "shift",

    synonims: {
        "shift": "shift",
        "lag": "shift"
    },

    "internal aliases":{

        "direction": "direction",
        "dir": "direction",
        "for": "direction",
        
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",

        "interval": "interval",
        "lag": "interval",

        "indexes" : "indexes",
        "values"  : "indexes",
        "series"  : "indexes"

    },

    defaultProperty: {},

    execute: function(command, state, config) {
        // console.log(JSON.stringify(command))
        if (state.head.type != "table")
            throw new LagImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Columns",
            interval: params.interval || 0,
            indexes: params.indexes || [] 
        } : {
            direction: "Columns",
            interval: 0,
            indexes: []
        }


        if (!util.isArray(params.indexes))
            throw new LagImplError("Incompatible indexes value: " + JSON.stringify(params.indexes) + ".")

        if (!util.isNumber(params.interval))
            throw new LagImplError("Incompatible interval value: " + JSON.stringify(params.interval) + ".")

        if (params.direction != "Rows" && params.direction != "Columns")
            throw new LagImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new LagImplError(e.toString())
        }
        return state;
    },
     help: {
        synopsis: "Shift time series",

        name: {
            "default": "shift",
            synonims: ["shift", "lag"]
        },
        input:["table"],
        output:"table",
        "default param": "none",
        params: [{
            name: "direction",
            synopsis: "Direction of iteration (optional)",
            type:["Rows", "row", "Columns", "col"],
            synonims: ["direction", "dir", "for"],
            "default value": "Columns"
        }, {
            name: "indexes",
            synopsis: "Array of 0-based index of time series (optional)",
            type:["array of index"],
            synonims: ["values", "series", "indexes"],
            "default value": []
        },
        {
            name: "interval",
            synopsis: "Shift interval (optional)",
            type:["number"],
            synonims: ["interval", "lag"],
            "default value": 0
        }],
        example: {
            description: "Shift first time serie",
            code:   "<?javascript\r\n\r\n    $context.eqFirstMeta = function(a,b){\r\n      return a.metadata[0].id == b.metadata[0].id\r\n    };\r\n\r\n?>\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\",items:[\"NSMS_DAU001_NFD004\"]}\r\n])\r\n\r\norder(for:\"row\",as:\"az\", by:-1)\r\nnorm(for:\"col\",method:\"std\")\r\nformat(1)\r\n\r\nset('srcSerie')\r\n\r\nshift(for:\"col\", interval:-3, series:[0])\r\n\r\njoin(\r\n    with:{{srcSerie}}, \r\n    on:{{eqFirstMeta}},\r\n    method:'left',\r\n    pref:'srcSerie: '\r\n)\r\n\r\nline(x:-1,y:[0,1])\r\n"

        }
    }
}
