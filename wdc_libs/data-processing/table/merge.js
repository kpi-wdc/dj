// aggregate table


var STAT = require("../lib/stat"),
	transposeTable = require("./transpose");



module.exports = function(table,params){

// 	merge:{
// 		enable:true,
// 		direction:"Rows",
// 		master:0,
// 		slave:1
// 	}



	if(!params.merge) return table;
	if(!params.merge.enable) return table;
	
	var merge = params.merge;

	if(merge.direction == "Columns") table = transposeTable(table,{transpose:true});
	var master = merge.master;
	var slave = merge.slave;
	
	var merged = []
	table.body[master].value.forEach(function(mValue,index){
		merged.push((mValue !=null) ? mValue : table.body[slave].value[index])
	})	

	table.body[master].value = merged;
	

	if(merge.direction == "Columns") table = transposeTable(table,{transpose:true});
	
	return table;	
}