var MD5 = require('object-hash').MD5;
var Promise = require('bluebird');
var util = require("util");


module.exports = {
	
	get: function (query){
		// console.log("get", query)
		return CacheData.findOne({hash:MD5(query)}); 
	},
	



	_save: function(tag, query, json,resolve){
			if(util.isArray(json) && json.length == 0 ) json = {};

				this.get(query)
					.then(function(obj){
						if (obj){
							resolve( CacheData.update(
								{hash  : MD5(query)},
								{
									value : json,
									"tag" : tag
								})
							)
						}else{
							resolve(
							 CacheData.create({
								hash  : MD5(query),
								value : json,
								"tag" : tag
							})
							)					
						}
					})
					
		},

	save: function(tag,query,json){
		var thos = this;
		return new Promise(function(resolve){
			thos._save(tag,query,json,resolve);
		});	
	},

	delete: function(query){
		return CacheData.destroy({hash:MD5(query)})
	},

	clear: function(tag){
		console.log("clear", tag)
		if( tag ){
			return CacheData.destroy({"tag":tag});	
		}
		return CacheData.destroy({});
	},

	list: function(){
		return CacheData.find({});
	}

}	