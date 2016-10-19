// Transpose Table


module.exports = function(table,params){
	if (!params.transpose) return table;
	var tBody = table.header;
	var values = [];
	table.body.forEach(function(row){
		values.push(row.value)
	})

	
	tValues = [];
	for(var i=0; i < values[0].length; i++){
		tValues.push(
			values.map(function(item){
				return item[i]
			})
		)
	}

	var tHeader = table.body;
	tHeader.forEach(function(item){
		item.value = undefined;
	})
	
	tBody.forEach(function(item,index){
		item.value = tValues[index]
	})

	table.body = tBody;
	table.header = tHeader;
	
	return table;	 
}