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
		if(params.var){
			if(		util.isUndefined(params.value)
				|| 	params.value =="" 
				|| 	params.value =="$"){
				scriptContext[params.var] = copyObject(data);
				return data;
			}else{
				if(util.isString(params.value)){
					scriptContext[params.var] = copyObject(getProperty(data,params.value));
					return data;
				}
				if(util.isArray(params.value)){
					scriptContext[params.var] = [];
					params.value.forEach(function(item){
						scriptContext[params.var].push(copyObject(getProperty(data,item)))
					})
					return data;
				}
				if(util.isObject(params.value)){
					scriptContext[params.var] = {};
					for(var key in params.value){
						scriptContext[params.var][key] = copyObject(getProperty(data,params.value[key]))
					}
					return data;
				}	

			}
		}else{
			return data;
		}
}	
	