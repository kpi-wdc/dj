var MD5 = require('object-hash').MD5;
var Promise = require('bluebird');
var util = require("util");


module.exports = {
	
	get: function (query){
		
		return CacheData.findOne({hash:MD5(query)}); 
	},
	
	getById: function (_id){
		// console.log("get", query)
		if(util.isArray(_id)) return CacheData.findByIdIn(_id)
 		return CacheData.findOne({id:_id}); 
	},

	_save: function(tag, query, json, params, resolve){
			if(util.isArray(json) && json.length == 0 ) json = {};

				this.get(query)
					.then(function(obj){
						if (obj){
							resolve( CacheData.update(
								{hash  : MD5(query)},
								{
									value : json,
									params: params,
									"tag" : tag
								})
							)
						}else{
							resolve(
							 CacheData.create({
								hash  : MD5(query),
								value : json,
								params: params,
								"tag" : tag
							})
							)					
						}
					})
					
		},

	save: function(tag,query,json,params){
		var thos = this;
		return new Promise(function(resolve){
			thos._save(tag,query,json,params,resolve);
		});	
	},

	update: function(id,json){
		return new Promise(function(resolve){
			CacheData
				.update({"id":id},{value:json})
				.then(function(result){
					resolve(result)
				})	
		})
	},

	delete: function(query){
		return CacheData.destroy({hash:MD5(query)})
	},

	clear: function(tag){
		// console.log("clear", tag)
		if( tag ){
			return CacheData.destroy({"tag":tag});	
		}
		return CacheData.destroy({});
	},

	list: function(){
		return CacheData.find({});
	}

}	