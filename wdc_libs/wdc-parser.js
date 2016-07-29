var Promise = require('bluebird');
var csvtojson = require("csvtojson").Converter;
var xlsxtojson = require("./wdc-xlsx2json");
var fs = require('fs');
var xmltojson = require('xml2js');

var formatter = {

	csv : function(filename,options){
		var converter = new csvtojson(options);
		var transform = function(resolve){
			converter.fromFile(filename,function(err,result){
				resolve(result)
			});	
		}
		return new Promise(function(resolve){
	        transform(resolve);
	    }); 
	},

	xlsx: function(filename,options){
		var transform = function(resolve){
			var workbook = xlsxtojson.convert(xlsxtojson.parseFile(filename));
			resolve(workbook)
		}
		return new Promise(function(resolve){
	        transform(resolve);
	    });
	},

	xml: function(filename,options){
		var transform = function(resolve){
			var parser = new xmltojson.Parser();
			fs.readFile(filename, function(err, data) {
			    parser.parseString(data, function (err, result) {
			    	resolve(result)
			    });
			});
		}
		return new Promise(function(resolve){
	        transform(resolve);
	    });
	},

	json: function(filename,options){
		var transform = function(resolve){
			
			fs.readFile(filename, function(err, data) {
			    var result = JSON.parse(data);
			    resolve(result)
			});
		}
		return new Promise(function(resolve){
	        transform(resolve);
	    });
	}
}



var Parser = function(options){
	var thos = this;
	this.options = options;

	this.loadPromise = formatter[options.reader.type](options.filename,options.reader.options);
} 

Parser.prototype = {
	execute: function(cb){
		var thos = this;
		var _execute = function(resolve){
			if(thos.loadPromise){
				thos.loadPromise.then(function(data){
					thos.src = data;
					thos.loadPromise = undefined;
					resolve(cb(thos.src))
				})
			} else { resolve(cb(thos.src)) }	
		}
		return new Promise(function(resolve){ _execute(resolve)})
	},

	validate: function(){
		if(this.options.validate) return this.execute(this.options.validate);
	},

	metadata: function(){
		if(this.options.metadata) return this.execute(this.options.metadata);
	},

	data: function(){
		if(this.options.data) return this.execute(this.options.data);
	},

	dictionary: function(){
		if(this.options.dictionary) return this.execute(this.options.dictionary);
	},

	i18n: function(){
		if(this.options.i18n) return this.execute(this.options.i18n);
	},
}

module.exports = Parser;