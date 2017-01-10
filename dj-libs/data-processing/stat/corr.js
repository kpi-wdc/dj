// returns correlation matrix

var transposeTable = require("../table/transpose"),
	STAT = require("../lib/stat");


module.exports = function(table,params){
	// if(!params.correlation) return table;
	// if(!params.correlation.enable) return table;
	
	var correlation= (params.correlation) ? params.correlation : params;

	if(correlation.direction == "Columns") table = transposeTable(table,{transpose:true});

	table.header = table.body.map(function(row){return {metadata:row.metadata}});
	var values = [];
	for(var i=0; i<table.body.length; i++){
		var v = [];
		for(var j=0; j<table.body.length; j++){
			v.push(STAT.corr(table.body[i].value,table.body[j].value))
		}
		values.push(v);
	}
	table.body.forEach(function(row,index){
		row.value = values[index]
	})
	
	return table;
}