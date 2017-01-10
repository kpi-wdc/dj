var util = require("util");
var _ = require("lodash-node");


var plain = function(object){
	var result = [];
	
	var pathes = function(o,p){
			
		

		if(util.isArray(o)){
			o.forEach(function(item,index){
				pathes(item, p+".["+index+"]")
			})
			return
		}

		if(util.isObject(o)){
			for(key in o){
				// if(!util.isFunction(o[key])) 
					pathes(o[key], p+"."+key)
			}
			return
		}

		if(util.isFunction(o) || util.isString(o) || util.isNumber(o) || util.isBoolean(o) || util.isNull(o)){
			result.push({path:p, value:o})
			return
		}
	}
	
	if(util.isFunction(object) || util.isString(object) || util.isNumber(object) || util.isBoolean(object) || util.isNull(object)){
		result.push({
			path:".",
			value:object
		})
	}else{
		pathes(object,[]);
	}		
		
	result = result.map(function(item){
		return {
			path : item.path.substring(1,item.path.length),
			value: item.value
		}	
	})

	return result;
}



var apply = function( o, p ){

	var applyPath = function(o,p,v){

		p = p.split(".");
		var current = o;

		p.forEach(function(item, index){
				
				if(item.indexOf("[")==0){
					var key = new Number(item.substring(1, item.length-1))
					if(!current[key]){
						if(key > (current.length-1)){
							for(var i=(current.length-1); i<key; i++){
								current.push({})
							}
						}
					}
					// console.log(index+":::"+(p.length-1))
					if(index == p.length-1){
						current[key] = v
					}else{
						// console.log("prop: "+p[index+1])
						if(p[index+1].indexOf("[")==0){
							// console.log("it is array")
							current[key] = (util.isArray(current[key]))? current[key] : [];
							// console.log(current[key])

						} else {
							// console.log("it is object")
							
							current[key] = current[key] || {};
							// console.log(current[key])

						}	

					}
					// console.log(current)
					current = current[key]
					// console.log("..", key, "array: "+util.isArray(current))
					// console.log(current)
				}else{
					// console.log("set", item, current)
					if((index < p.length-1) && p[index+1].indexOf("[")==0){
						current[item] = (index == p.length-1) ? v : current[item] || [];

					}else{
						current[item] = (index == p.length-1) ? v : current[item] || {};	
					}	

					current = current[item];	
				}
		});
		return o;
	}

	
	if(!util.isArray(p)){
		p = [p];
	}

	p.forEach(function(item){
		// console.log("apply",item.path)
		applyPath(o, item.path, item.value)
	})

	return o;

}


var deepCopy = function(obj){
	var result = null
	if(!util.isUndefined(obj)) result =  obj;
	if(util.isString(obj)) result =  obj;
	if(util.isNumber(obj)) result =  obj;
	if(util.isBoolean(obj)) result =  obj;
	if(util.isFunction(obj)) result = obj;
	if(util.isNull(obj)) result = obj;
	if(util.isObject(obj)) result = obj;
	if(util.isObject(obj) || util.isArray(obj)) 
		result = (util.isArray(obj))? apply([], plain(obj)) : apply({}, plain(obj))
	return result
	// return _.cloneDeep(obj)
}

deepCopy.apply = function(obj,path,value){
	return apply(obj,path,value)
}

deepCopy.plain = function(obj){
	return plain(obj)
}

module.exports = deepCopy; 