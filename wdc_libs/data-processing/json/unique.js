var query = require("../../wdc-query");
var util = require("util")

module.exports = function(data,params){
	if(util.isArray(data)){
		var res = new query()
						.from(data)
						.distinct()	
						.get()
		return  res;
	}

	return data;
}