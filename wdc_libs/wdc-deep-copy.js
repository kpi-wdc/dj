var util = require("util");



var plain = function(object){
	var result = [];
	
	var pathes = function(o,p){
		// console.log("PATHES", JSON.stringify(o))

		if(util.isString(o) || util.isNumber(o) || util.isBoolean(o)){
			// console.log("VALUE")
			result.push({path:p, value:o})
			return
		}

		if(util.isArray(o)){
			// console.log("ARRAY")
			o.forEach(function(item,index){
				pathes(item, p+".["+index+"]")
			})
			return
		}

		if(util.isObject(o)){
			// console.log("OBJECT")
			for(key in o){
				if(!util.isFunction(o[key])) pathes(o[key], p+"."+key)
			}
			return
		}
		
	}
	
	pathes(object,[]);
	result = result.map(function(item){
		// console.log(">>", item)
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
				// console.log("current ", current)
				// console.log("key ", item)
				
				if(item.indexOf("[")==0){
					var key = new Number(item.substring(1, item.length-1))
					if(!current[key]){
						if(key > (current.length-1)){
							for(var i=(current.length-1); i<key; i++){
								current.push({})
							}
						}
					}
					if(index == p.length-1){
						current[key] = v
					}
					current = current[key]
					
				}else{
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
		applyPath(o, item.path, item.value)
	})

	return o;

}


var deepCopy = function(obj){
	// console.log("COPY", JSON.stringify(obj))
	var result = null
	if(!util.isUndefined(obj)) result =  obj;
	if(util.isString(obj)) result =  obj;
	if(util.isNumber(obj)) result =  obj;
	if(util.isBoolean(obj)) result =  obj;
	if(util.isObject(obj) ||util.isArray(obj)) result = apply({}, plain(obj))
		// console.log("COMPLETE", JSON.stringify(result))
	return result
}

deepCopy.apply = function(obj,path,value){
	return apply(obj,path,value)
}

deepCopy.plain = function(obj){
	return plain(obj)
}

module.exports = deepCopy; 