//generate dependencies serie


module.exports = function(table,params){
	return table.body.map(function(row){
		var serie = {
			key: row.metadata.map(function(item){ return item.label}).join(", "),
			values: row.value.map(function(item,index){
				return {
					label:table.header[index].metadata.map(function(item){ 
						return item.label
					}).join(", "),
					value:item
				}
			})
		}
		return serie;
	})
}