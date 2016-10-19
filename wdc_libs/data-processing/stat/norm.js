// normalize values
// 

var   STAT            = require("../lib/stat"),
      transposeTable  = require("../table/transpose");


module.exports = function (table, params) {
  if(!params.normalization) return table;
  if(!params.normalization.enable) return table;

  var normalizeMode = params.normalization.mode || "Range to [0,1]"; 
  var normalizeArea = params.normalization.direction || "Columns";
  var precision = params.normalization.precision || null;

  var metaSuffix = "";
  if(normalizeArea == "Columns"){
  		table = transposeTable(table,{transpose:true});
  }
	table.body.forEach(function(currentRow){
		switch (normalizeMode) {
          case "Range to [0,1]":
            currentRow.value = STAT.normalize(currentRow.value);
            break;
          case "Standartization":
            currentRow.value = STAT.standardize(currentRow.value);
            break;
          case "Logistic":
            currentRow.value = STAT.logNormalize(currentRow.value);
            break;
        };
        currentRow.value = currentRow.value.map(function(currentValue){
        	return (currentValue == null) ? null : 
        	(precision != null) ? new Number (Number(currentValue).toPrecision(precision)) : currentValue;
        })
	})
	table.body.forEach(function(col){
		col.metadata[col.metadata.length-1].id += metaSuffix;
		col.metadata[col.metadata.length-1].label += metaSuffix;
	})

	if(normalizeArea == "Columns"){
		table = transposeTable(table,{transpose:true});
	}
	return table;
}