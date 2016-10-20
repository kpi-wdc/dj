// sort table rows(columns)
// 

var transposeTable = require("./transpose");
require('string-natural-compare');
var date = require("date-and-time");


var Compare = {

	"geo" : {
		"A-Z" : function(a,b){
			return String.naturalCompare((a+'').toLowerCase(),(b+'').toLowerCase())
		},
		"Z-A": function(a,b){
			return String.naturalCompare((b+'').toLowerCase(),(a+'').toLowerCase())
		}	
	},

	"metric":{
		"A-Z" : function(a,b){
			return a-b
		},
		"Z-A": function(a,b){
			return b-a
		}	
	},

	"time": {
		"A-Z" : function(a,b){
			return date.subtract(new Date(a), new Date(b)).toMilliseconds();
		},	
		"Z-A": function(a,b){
			return date.subtract(new Date(b), new Date(a)).toMilliseconds();
		}
	} 
}

module.exports = function(table,params){
	
	if(!params.order.enable) return table;

	var direction = (params.order.direction) ? params.order.direction : "Rows";//"Columns"
	var asc = (params.order.asc) ? params.order.asc : "A-Z"; //"Z-A"
	var index = (params.order.index) ? params.order.index : 0;


	// String.alphbet = 
			// "0123456789"
		// +	"ABCDEFGH"
		// +	"АБВГҐДЕЄЁЖЗИ"
		// // +	"JKLMNOPQRSTUVWXYZ"
		// 	"abcdefgh"
		// +	"бвагґдеєёжзи"
		// +	"ijklmnopqrstuvwxyz"
		// // +	"ЇЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
		// +	"іїйклмнопрстуфхцчшщъыьэюя";
	
	if(direction == "Columns") table = transposeTable(table,{transpose:true});

	var accessor = (index<0)
					? function(item){return item.metadata[-index-1].label }
					: function(item){return item.value[index]}
	

	var comparator = (index < 0)
						? (Compare[table.body[0].metadata[-index-1].role])
							? Compare[table.body[0].metadata[-index-1].role][asc]
							: Compare["geo"][asc]
						: Compare["metric"][asc]
						// (Compare[table.header[index].metadata[0].role])
						// 	? Compare[table.header[index].metadata[0].role][asc]
						// 	: Compare["geo"][asc]
	
	
	table.body.sort(function(a,b){
		return comparator(accessor(a),accessor(b))
	})					
	
	
	if(direction == "Columns") table = transposeTable(table,{transpose:true});

	return table;
}