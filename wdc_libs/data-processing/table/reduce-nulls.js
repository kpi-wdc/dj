// reduce rows(columns) with nulls
// 


module.exports = function(table,params){
	if(!params.reduce) return table;
	if(!params.reduce.enable) return table;
	var direction = params.reduce.direction || "Rows"; // "Columns"
	var mode = params.reduce.mode || "Has Null"; // "All Nulls"

	
	var	hasNull = function(data){
		var result = false;
		data.forEach(function(item){
			if (item == null || isNaN(new Number(item))){
				result = true;
			}
		});
		return result;
	};
	
	var	allNulls = function(data){
		var result = 0;
		data.forEach(function(item){
			if (item == null || isNaN(new Number(item))){
				result++
			}
		});
		return result == data.length;
	}

	var criteria = (mode == "All Nulls") ? allNulls : hasNull;

	if(direction == "Rows"){
		for(var rowIndex = 0; rowIndex < table.body.length;){
			if(criteria(table.body[rowIndex].value)){
				table.body.splice(rowIndex,1);
			}else{
				rowIndex++;
			}
		}
		
		return table;
	}

	if(direction == "Columns"){
		for(var columnIndex = 0; columnIndex < table.header.length;){
			var data = table.body.map(function(currentRow){
	  			return currentRow.value[columnIndex];
	  		});
			if(criteria(data)){
				table.header.splice(columnIndex,1);
				table.body.forEach(function (currentRow){
					currentRow.value.splice(columnIndex,1)	
				})
			}else{
				columnIndex++;
			}
		}
		table.reduced = true;
		return table;	
	}
	
}