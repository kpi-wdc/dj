// returns histogramm table
// 
var transposeTable = require("../table/transpose").transpose,
    STAT = require("../lib/stat"),
    util = require("util");

var HistImplError = function(message) {
    this.message = message;
    this.name = "Command 'histogram' implementation error";
}
HistImplError.prototype = Object.create(Error.prototype);
HistImplError.prototype.constructor = HistImplError;



var impl = function(table,params){
	
	var histogram= (params.histogram)? params.histogram : params;

	if(histogram.direction == "Columns") table = transposeTable(table,{transpose:true});
	
	var globalMax = STAT.max(table.body.map(function(row){return STAT.max(row.value)}));
	var globalMin = STAT.min(table.body.map(function(row){return STAT.min(row.value)}));
	
	var histTable = {
		metadata:table.metadata,
		header:[],
		body:[]
	}

	var step = (globalMax - globalMin) / histogram.beans;

	for (var j = 0; j < histogram.beans; j++) {
	  histTable.header.push({ metadata:[{
	  	dimension:"bean",
	  	dimensionLabel:"Bean",
	  	id:((globalMin+(j) * step).toFixed(3)+" - "+ (globalMin+(j+1) * step).toFixed(3)),
	  	label:((globalMin+(j) * step).toFixed(3)+" - "+ (globalMin+(j+1) * step).toFixed(3))
	  }]})
	}

	table.body.forEach(function(row){
		histTable.body.push({

			metadata: row.metadata.map(function(item){return item}),
			value:(
				function(data){
					var h = histTable.header.map(function(item){return 0});
					data.forEach(function(item){
						if(item !=null){
							var index = 
								Math.floor((item - globalMin) / (globalMax - globalMin) * histogram.beans);
							index = (index ==histogram.beans) ? index - 1 : index;
							h[index]++;
						}
					})
					if (histogram.cumulate){
						var s = 0;
						h.forEach(function (val) {
							val.y = s += val.y;
						});
					}
					h = h.map(function(item){return item/data.length})
					return h;
			})(row.value)
		})
	})

	return histTable;
}

module.exports = {
    name: "histogram",

    synonims: {
        "histogram": "histogram",
        "hist": "histogram"
    },
    
    "internal aliases": {    
        "direction": "direction",
        "dir": "direction",
        "for": "direction",
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",
        "beans":"beans",
        "bins":"beans"
    },

    defaultProperty: {
        "histogram": "direction",
        "hist": "direction",
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new HistImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Columns",
            beans: params.beans || 5
        } : {
            direction: "Columns",
            beans: 5
        }


        if (params.direction != "Rows" && params.direction != "Columns")
            throw new HistImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")
		if (!util.isNumber(params.beans))
            throw new HistImplError("Incompatible beans value: " + JSON.stringify(params.beans) + "'.")


        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new HistImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Build histogram",

        name: {
            "default": "histogram",
            synonims: ["histogram", "hist"]
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
            },{
                name: "beans",
                synopsis: "Bins count (optional)",
                type:["number"],
                synonims: ["beans", "bins"],
                "default value": 5
            }
            ],
        example: {
            description: "Build histogram for indicator NSMS_DAU001_NFD004",
            code:   "\r\n\r\n// load data from dataset storage\r\n\r\n    load(\r\n        ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n        as:'dataset'\r\n    )\r\n\r\n\r\n// get data cube projection\r\n\r\n    proj([\r\n      { dim:'time', as:'row'},\r\n      {\r\n        dim:'indicator',\r\n        as:'col',\r\n        values:['NSMS_DAU001_NFD004']\r\n      }\r\n    ])\r\n\r\n\r\n// create histogramm\r\n\r\n    hist(for:'col', beans:7)\r\n    format(3)\r\n\r\n\r\n// create bar chart\r\n\r\n    bar()\r\n"

        }
    }
}