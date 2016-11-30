// data processing implementation
// 

var keywords = require("./keywords")
var util = require("util");

var lookup = function(o){
	if (util.isDate(o)){
		return o;
	}

	if(util.isString(o)){
		return ((keywords[o.toLowerCase()])? keywords[o.toLowerCase()] : o)
	}

	if(util.isArray(o)){
		var res = [];
		o.forEach(function(item){
			res.push(lookup(item))
		})
		return res;
	}

	if(util.isObject(o)){
		var res = {};
		for (key in o){
			res[lookup(key)] = lookup(o[key])
		}
		return res;
	} 

	return o;
}



module.exports = {
	parse : function(str){
		var script = [];
		var commands = str.split(";")
		commands.forEach(function(c){
			if(c!=""){
				c = c.replace(/([a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+))/gim,"\"$1\"").replace(/'/g,'"');
				c = c.trim().replace(/[\n\t\r\f]*/g,"").replace("(",":").replace(")","");
				var t = lookup(JSON.parse("{"+c+"}"));
				script.push(t)
			}	
		})
		var result = {};
		result.source = script.splice(0,1)[0].source;
		result.script = script.map(function(c){
						return {
							processId : Object.keys(c)[0],
							settings : c[Object.keys(c)[0]]
						} 
					})
		return result;
	}
}
