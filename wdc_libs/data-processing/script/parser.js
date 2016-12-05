// data processing implementation
// 

var keywords = require("./keywords")
var util = require("util");
var logger = require("../../wdc-log").global;

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

		var values = str.match(
		/'((?:\\\\[\'bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\'\\\\])*)'|\"((?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*)\"/gim
		)


		function varIndex(tag){return  "^"+values.indexOf(tag)}

		function switchQ(tag){return (tag=="'")? '"' : "'"}

		function varValue(tag){return values[Number(tag.substring(1))].replace(/[\'\"]/gi, switchQ)}
		var p = str.replace(
			/'((?:\\\\[\'bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\'\\\\])*)'|\"((?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*)\"/gim
		, varIndex)
		
		p = p.replace(/\/\/[\w\S\ .\t\:\,;\'\"\(\)\{\}\[\]0-9-_]*(?:[\n\r]*)/gi,"")
			.replace(/[\r\n\t\s]*/gim,"")
			.replace(/\/\*[\w\b\.\t\:\,;\'\"\(\)\{\}\[\]0-9-_]*(?:\*\/)/gim,"")
			.replace(/(\))([a-zA-Z])/gim,"$1;$2")
			.replace(/\(([\w\b\.\t\:\,\'\"0-9-_]+[\w\b\.\t\:\,\'\"\[\]\^0-9-_]*)\)/gi,"({$1})")
			.replace(/([a-zA-Z-]+(?=[\(\)\{\}\:\[\]\s]+))/gim,"\"$1\"")
			.replace(/\'/gim,"\"")
			.replace(/\(\s*\)/gi,"({})")
			.replace(/\(/gim,":")
			.replace(/\)/gim,"")
			.replace(/\^[0-9]+/gim,varValue)
		
		// logger.debug("transform "+p)
		var script = [];
		var cmd = p.split(";")
		cmd.forEach(function(cm){
			// if(c!=""){
				logger.debug("parser process "+cm)
				var t = lookup(JSON.parse("{"+cm+"}"));
				script.push(t)
			// }	
		})
		
		var result = script.map(function(c){
						return {
							processId : Object.keys(c)[0],
							settings : c[Object.keys(c)[0]]
						} 
					})
		return result;
	},

	stringify: function(script){
		return script.map(function(c){
			return c.processId+"("+JSON.stringify(c.settings)+")"
		}).join(";")
	},

	applyContext: function(template, context){
      var getContextValue = function(){
          var tags =arguments[1].split(".")
          var value = context;
          tags.forEach(function(tag){
            tag = tag.trim();
            value = value[tag] 
          })

          return value
      }
      return template.replace(/(?:\{\{\s*)([a-zA-Z0-9_\.]*)(?:\s*\}\})/gim, getContextValue)
    }

}//eof
