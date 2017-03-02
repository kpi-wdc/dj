var util = require("util");
var copy = require("../../../deep-copy"); 



var entity ={
	csv : function(value){
		var res = new String(value)
		res.__type = "csv"
		return res;
	},

	html: function(value){
		var res = new String(value)
		res.__type = "html" 
		return res;
	},

	xml: function(value){
		var res = new String(value)
		res.__type = "xml" 
		return res;
	},

	dps: function(value){
		var res = new String(value)
		res.__type = "dps" 
		return res;
	}
}


module.exports = {
	
	entity: entity,
	typeOf: function(obj){
		return (obj.__type) ? obj.__type : typeof obj
	}
}	