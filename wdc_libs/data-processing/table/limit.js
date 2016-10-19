// limits table rows


module.exports = function(table,params){

	if(!params.limit) return table;
	if(!params.limit.enable) return table;
	
	var limit = params.limit;
	table.body = table.body.filter(function(item,index){
		return ((index+1) >= limit.start) && ((index+1) < (limit.start+limit.length))
	})

	return table;
}