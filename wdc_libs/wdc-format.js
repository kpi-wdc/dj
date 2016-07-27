var csvtojson = require("csvtojson").Converter;
var xlsxtojson = require("./wdc-xlsx2json");
var fs = require('fs');
var xmltojson = require('xml2js');
var Promise = require('bluebird');

module.exports = {

	csv2json : function(filename){
		var converter = new csvtojson({});
		var transform = function(resolve){
			converter.fromFile(filename,function(err,result){
				resolve(result)
			});	
		}
		return new Promise(function(resolve){
	        transform(resolve);
	    }); 
	},

	xlsx2json: function(filename){
		var transform = function(resolve){
			var workbook = xlsxtojson.convert(xlsxtojson.parseFile(filename));
			resolve(workbook.Sheets)
		}
		return new Promise(function(resolve){
	        transform(resolve);
	    });
	},

	xml2json: function(filename){
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
	}

}