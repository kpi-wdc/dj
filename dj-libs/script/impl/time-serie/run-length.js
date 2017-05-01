// lag time serie


var STAT = require("../lib/stat"),
    transposeTable = require("../table/transpose").transpose,
    util = require("util");
    _ = require("lodash-node");


var RNImplError = function(message) {
    this.message = message;
    this.name = "Command 'smoose' implementation error";
}
RNImplError.prototype = Object.create(Error.prototype);
RNImplError.prototype.constructor = RNImplError;



var impl = function(table, params) {
    
    var rn = (params.rn) ? params.rn : params;
    
    if (rn.direction == "Columns") table = transposeTable(table, { transpose: true });
    
    rn.interval = rn.interval || [-1,1];
    
    rn.indexes = rn.indexes || [];
    
    if(rn.indexes.length == 0){
        rn.indexes = _.range(table.body.length)
    }

    rn.indexes.forEach(function(index){
        var newValue = []; 
        for(var i = 0; i < table.body[index].value.length; i++){
            var win = [];
            for(var j = rn.interval[0]; rn.interval[1] >= j; j++){
                if(table.body[index].value[i+j] != undefined) win.push(table.body[index].value[i+j])
            }
            newValue.push(_.sum(win)/(rn.interval[1]-rn.interval[0]+1));
        }
        table.body[index].value = newValue;
    })

    if (rn.direction == "Columns") table = transposeTable(table, { transpose: true });

    return table;
}

module.exports = {
    name: "smoose",

    synonims: {
        "smoose": "smoose",
        "runlenght": "smoose"
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
        "window": "interval",

        "indexes" : "indexes",
        "values"  : "indexes",
        "series"  : "indexes"

    },

    defaultProperty: {},

    execute: function(command, state, config) {
        // console.log(JSON.stringify(command))
        if (state.head.type != "table")
            throw new RNImplError("Incompatible context type: '" + state.head.type + "'.")
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
            throw new RNImplError("Incompatible indexes value: " + JSON.stringify(params.indexes) + ".")

        if (!util.isArray(params.interval))
            throw new RNImplError("Incompatible interval value: " + JSON.stringify(params.interval) + ".")

        if (params.direction != "Rows" && params.direction != "Columns")
            throw new RNImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new RNImplError(e.toString())
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
            synonims: ["interval", "window"],
            "default value": 0
        }],
        example: {
            description: "Shift first time serie",
            code:   "<?javascript\r\n\r\n    $context.eqFirstMeta = function(a,b){\r\n      return a.metadata[0].id == b.metadata[0].id\r\n    };\r\n\r\n?>\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\",items:[\"NSMS_DAU001_NFD004\"]}\r\n])\r\n\r\norder(for:\"row\",as:\"az\", by:-1)\r\nnorm(for:\"col\",method:\"std\")\r\nformat(1)\r\n\r\nset('srcSerie')\r\n\r\nshift(for:\"col\", interval:-3, series:[0])\r\n\r\njoin(\r\n    with:{{srcSerie}}, \r\n    on:{{eqFirstMeta}},\r\n    method:'left',\r\n    pref:'srcSerie: '\r\n)\r\n\r\nline(x:-1,y:[0,1])\r\n"

        }
    }
}
