var Promise = require('bluebird');
module.exports = {
	
	load: function(filename){
		console.log("load "+filename)
		thos = this; 
		var formatter = require("../../wdc-format")
		this.loadPromise = formatter.xlsx2json(filename) 
		return this.loadPromise;
	},

	validate: function(filename){
		var thos = this;
		
		var _validate = function(resolve){
			if(!thos.source || thos.filename != filename){
				thos.source = undefined;
				thos.filename = filename;
				thos.loadPromise = thos.loadPromise || thos.load(filename);
				thos.loadPromise.then(function(data){
						thos.loadPromise = undefined;
						thos.source = data;
						// 
						// 
						//======== validate data ==========
						//
						//
						resolve(thos.source)
					})
			}else{
				// 
						// 
						//======== validate data ==========
						//
						//
				resolve(thos.source)
			}
		}

		return new Promise(function(resolve){
			_validate(resolve)
		})

	},

	parseMetadata: function(){
		this.source = this.source || this.load();
	},

	parseData: function(){
		this.source = this.source || this.load();
	},

	parseDictionary: function(){
		this.source = this.source || this.load();
	},

	parseI18n: function(){
		this.source = this.source || this.load();
	},


	run : function(){
		if(!this.source){
			this.load().then(function(result){
				console.log(result);
			})	
		}	
	}
}	