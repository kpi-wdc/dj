var util = require("util");
var jp = require("jsonpath");
var copyObject = require('../../wdc-deep-copy');

var getProperty = function(d,path){
	var result = undefined;
	jp.apply(d,path, function(value){
		if(util.isUndefined(result)){
			result = value;
		}else{
			if(!util.isArray(result)){
				result = [result]
			}
			result.push(value)
		}
		return value
	})
	return result
}

module.exports = function(data, params, locale, script, scriptContext){
		if(		util.isUndefined(params) 
			|| 	util.isUndefined(params.path) 
			|| 	params.path =="" 
			|| 	params.path=="$"){
			return copyObject(scriptContext);
		}
		return copyObject(getProperty(scriptContext,params.path))
}	
	