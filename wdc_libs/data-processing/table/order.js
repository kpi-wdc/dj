// sort table rows(columns)
// 

var transposeTable = require("./transpose");
require('string-natural-compare');


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

	
	table.body.sort(function(a,b){
		if(index<0){
			var j = -index-1;
			if (asc == "Z-A"){
				return (!isNaN(new Number(a.metadata[j].label)) 
					    && !isNaN(new Number(b.metadata[j].label)))
					? b.metadata[j].label - a.metadata[j].label
					: String.naturalCompare(b.metadata[j].label.toLowerCase(),a.metadata[j].label.toLowerCase())
			}

			if (asc == "A-Z"){
				return (!isNaN(new Number(a.metadata[j].label)) 
					    && !isNaN(new Number(b.metadata[j].label)))
					? a.metadata[j].label - b.metadata[j].label
					: String.naturalCompare(a.metadata[j].label.toLowerCase(),b.metadata[j].label.toLowerCase())
			}			 
		}else{
			var j = index;
			if (asc == "Z-A"){
				return (!isNaN(new Number(a.value[j])) 
					    && !isNaN(new Number(b.value[j])))
					? b.value[j] - a.value[j]
					: String.naturalCompare(b.value[j].toLowerCase(), a.value[j].toLowerCase())
			}

			if (asc == "A-Z"){
				return (!isNaN(new Number(a.value[j])) 
					    && !isNaN(new Number(b.value[j])))
					? a.value[j] - b.value[j]
					: String.naturalCompare(a.value[j].toLowerCase(),b.value[j].toLowerCase())
			}
		}
		
	})

	if(direction == "Columns") table = transposeTable(table,{transpose:true});

	return table;

}