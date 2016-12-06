var jp= require("jsonpath");

module.exports = function(data,params){
	if(params.path){
		return jp.query(data,params.path)
	}
	return data;
}