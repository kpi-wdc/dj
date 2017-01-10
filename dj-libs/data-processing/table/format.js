// format numbers 

module.exports = function(table,params){
	if( params.precision != undefined && params.precision != null && params.precision >=0 ){
		table.body.forEach(function(currentRow){
			currentRow.value = currentRow.value.map(function(item){
				return (item == null) ? null : 
					(!isNaN(new Number(item))) ? new Number(item).toFixed(params.precision)/1 : 
					item
			})
			// console.log(currentRow.value)
		})
	}
	return table;
}

