util = require("util");
exports.intersect = function(a,b,callback){
	callback = (callback) ? callback : function(a,b){return a==b}
	var temp = a.concat(b).sort(function(a,b){return a-b});
	var i = 0;
	while(i < temp.length){
		if( (i>0) && callback(temp[i],temp[i-1])){
			temp.splice(i,1)
		}else{
			i++
		}

	}
	return temp.filter(function(item){
		return a.indexOf(item)>=0 && b.indexOf(item)>=0
	})
}


