// Generate Bar Series


module.exports = function(table,params){
	  
	var result = [];
      table.body.forEach(function(serieData){
      	var currentSerie = {
      		key:serieData.metadata[0].label,
      		role:serieData.metadata[0].role,
      		format:serieData.metadata[0].format,
      		label:{
      			role:table.header[0].metadata[0].role,
      			format:table.header[0].metadata[0].format
      		},
      		values:[]}
      	table.header.forEach(function(currentColumn,index){
      		currentSerie.values.push(
      				{
      					label : currentColumn.metadata[0].label,
      					value : serieData.value[index]
      				}
      			)
      	})
      	result.push(currentSerie)
      })

      return result;
}