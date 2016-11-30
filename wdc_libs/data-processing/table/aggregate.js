// aggregate table


var STAT = require("../lib/stat"),
	transposeTable = require("./transpose");



module.exports = function(table,params){

// 	aggregation:{
// 		enable:true,
// 		direction:"Rows",
// 		data:["max","min","avg","std","sum"]
// 	}



	// if(!params.aggregation) return table;
	// if(!params.aggregation.enable) return table;
	
	var aggregation = (params.aggregation)?params.aggregation:params;

	if(aggregation.direction == "Columns") table = transposeTable(table,{transpose:true});

	aggregation.data
		.forEach(function(item){
			var hmetaTemplate = table.header[0].metadata
			.map(function(m,index){
				return {
					dimension : m.dimension,
					dimensionLabel : m.dimensionLabel,
					id : "",
					label : ""
				}
			});
			var lastMeta = hmetaTemplate[hmetaTemplate.length-1];
	   		lastMeta.id = item;
			lastMeta.label = item;
			table.header.push({metadata:hmetaTemplate});
		})

	table.body
		.forEach(function(row){
			var v = row.value;
			var additional = [];
			aggregation.data
				.forEach(function(item){
					if(item == "min"){
						additional.push(STAT.min(v))
					}
					if(item == "max"){
						additional.push(STAT.max(v))
					}
					if(item == "avg"){
						additional.push(STAT.mean(v))
					}
					if(item == "std"){
						additional.push(STAT.std(v))
					}
					if(item == "sum"){
						additional.push(STAT.sum(v))
					}
			})
			row.value = row.value.concat(additional);	
		})	
		

	if(aggregation.direction == "Columns") table = transposeTable(table,{transpose:true});
	
	return table;	
}