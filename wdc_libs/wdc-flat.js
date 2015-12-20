util = require("util");

exports.flat2json = function(pathes){
	
	setProperty = function(object,path,value){
		path = path.split(".");
		pos = path[path.length-1].indexOf("[]");
		if(pos>=0){
			value = (value) ? value.split(",") : [];
			path[path.length-1] = path[path.length-1].substring(0,pos);	
		}
		value = (util.isArray(value)) ? value : [value];
		for(i in value){
				value[i] = (value[i] && value[i].trim) ? value[i].trim() : value[i];
			};
		value = (value.length == 1) ? value[0] : value; 
		current = object;
		path.forEach(function(item, index){
				current[item] = (index == path.length-1) ? value : current[item] || {};
				current = current[item];
		});
	}
	
	result = {};
	pathes.forEach(function(item){
		setProperty(result,item.path,item.value)
	});
	return result;
} 

exports.json2flat = function(object){
	plane = [];
	p = function(object,path){
		for(prop in object){
			path.push(prop);
			if(util.isArray(object[prop]) || !util.isObject(object[prop])){
				key = path.join(".");
				key += (util.isArray(object[prop]))? "[]" : '';
				plane.push({
					path:key, 
					value:(util.isArray(object[prop]))? object[prop].join(","):object[prop]
				});
			path.splice(-1,1);	
			}else{p(object[prop],path)}
		}
		path.splice(-1,1);
	}
	p(object,[]);
	return plane;
}




function getSimpleProperty (obj,path){
  if(path === "" || !path) {return obj}
  var res = obj;
  path = path.split(".");
  if (!res) return undefined;
  for(var i in path){
  	   if(res[path[i]]){
	      res = res[path[i]];
	    }else{
	      return undefined;
	    }
  }
  
  
  if(util.isObject(res)){
  	return res;
  }
  
  res = (res.split) ? res.split(",") : res;
  for(var i in res){
    res[i] = res[i].trim();
  }
  return res;
}


function getProperty(obj,path){
	if(path === "") {return obj}
  	var buf = [obj];
    var result;

  	path = path.split("*");
  	path.forEach(function (p){
  		result = buf;
  		buf = [];
  		result.forEach(function(res){
	  		if(p.match("."+"$") == "."){
	  			var mp = p.slice(0,p.length-1);
	  			mp = (mp.indexOf(".")==0) ? mp.slice(1) : mp;
	  			var o = getSimpleProperty(res,mp)
	  			for(var i in o){
	  				buf.push(getSimpleProperty(o,i))
	  			}
	  		}else{
				var mp = p;
	  			mp = (mp.indexOf(".")==0) ? mp.slice(1) : mp;
	  			buf.push(getSimpleProperty(res,mp))
	  		}
	    })
  	})
  	result = [];
  	buf.forEach(function(item){
  		result = result.concat(item);
  	})
  	return result;
}

exports.getProperty = getProperty