// data imputation

var transposeTable = require("../table/transpose");


module.exports = function(table, params){
	// if(!params.inputation) return table;
	// if(!params.inputation.enable) return table;
	var inputation = (params.inputation) ? params.inputation : params;
	var direction = (inputation.direction) ? inputation.direction : "Rows";//"Columns"
	var from = (inputation.from) ? inputation.from : "left"; //"right"
	var mode = (inputation.mode) ? inputation.mode : "fill"; //"mean","fit", ... etc

	if(direction == "Columns") table = transposeTable(table,{transpose:true});

	table.body.forEach(function(row){
		if( mode == "fill" ){
			if (from == "left"){
				var leftValue = row.value[0];
				row.value = row.value.map(function(v){
					if(v == null) return leftValue
					leftValue = v;
					return v;	
				})
				
				// input current value as left value 
			} else {
				// input current value as right value 
			}
		}
		if( mode == "mean" ){
			// input current value as mean between left and right
		}
		if (mode == "fit"){
			// input current value as fitted value between left and right
		}
	})

	if(direction == "Columns") table = transposeTable(table,{transpose:true});

	return table;
}