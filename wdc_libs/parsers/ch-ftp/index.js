var Parser = require("../../wdc-parser");
var Promise = require("bluebird");
var query = require('../../wdc-query');
var util = require("util");
var FO = require("../../wdc-flat");
var date = require('date-and-time');
var copyObject = require('copy-object');
var glob = require("glob")
var date = require('date-and-time');
require('string-natural-compare');
var Coder = require("../../wdc-coder");
var downloadData = require("./download"); 
var aggregate = require("./aggregate");

var product = {};

module.exports = function (filename){
	var product = {};

	var parser = new Parser(
		{
			filename : filename,
			
			reader: {
				type: "xlsx"
			},

			validate: function(workbook){
				  return {}; 
			},

			metadata: function(workbook){
				// console.log("metadata")
			      var metadataSheet = workbook.Sheets['metadata'];
				  var dictionarySheet = workbook.Sheets['dictionary'];
				  var i18nSheet = workbook.Sheets['i18n'];

				  var metadata, data, dictionary;

				  if (metadataSheet != undefined) {
				    return FO.flat2json(
				      new query()
				        .from(metadataSheet)
				        .map(function (item) {
				          return {path: item.key, value: item.value}
				        })
				        .get());
					} else {
				    throw new Error('No metadata sheet found in the document');
				  }
			},

			dictionary: function(workbook){
			  var dictionarySheet = workbook.Sheets['dictionary'];
			  var dictionary;

			 
			  if (dictionarySheet != undefined) {
			    var dict = workbook.Sheets['dictionary'];
			    dictionary = [];

			    dict.forEach(function (item) {
			      pathes = [];
			      for (i in item) {
			        if (i.indexOf("__") != 0 && item[i] != undefined && item[i] != null) {
			          pathes.push({path: i, value: item[i]})
			        }
			      }
			      dictionary.push(FO.flat2json(pathes));
			    })
			  } else {
			    throw new Error('No dictionary sheet found in the document');
			  }

			  return dictionary
			},

			i18n: function(workbook){

			  var i18nSheet = workbook.Sheets['i18n'];
			  var dictionary;

			  if (i18nSheet != undefined) {

			    dictionary = dictionary || [];

			    i18nSheet.forEach(function (item) {
			      pathes = [];
			      for (i in item) {
			        if (i.indexOf("__") != 0 && item[i] != undefined && item[i] != null) {
			          pathes.push({path: i, value: item[i]})
			        }
			      }
			      tmp = FO.flat2json(pathes);
			      tmp.type = "i18n";
			      dictionary.push(tmp);
			    })
			  } 

			  return dictionary
			},

			data: function(workbook){
				var indicators = product.metadata.layout.indicator;
				var conf = product.metadata.layout.ftp;
				conf.patterns = []; 
				for(var id in indicators){
					conf.patterns.push(indicators[id].files)
				}

				// return downloadData(conf)
				// 	.then( function(){




					var result = [];
					var promises = [];
					for(var id in indicators){
						indicators[id].files = glob.sync(conf.dest+indicators[id].files)
						indicators[id].files.forEach(function(file){
							// console.log("process "+file);
							var csvParser = new Parser(
								{
									filename : file,
									reader:{
										type: "csv",
										encoding:"win1251",
										options:{
											delimiter: ";"
										}
									},
									data: function(src,args){
										var id = args[0];
										return src.map(function(item){
											var t = item.DATE.toString() 
													+ ":"
													+ item.HOUR.toString()
													+":0";
											
											return {
												"#value":item.AVG,
												"indicator":indicators[id].label,
												"#indicator":id,
												"time": date.parse(t,"YYYYMMDD:H:m"),
												"#time": date.parse(t,"YYYYMMDD:H:m")
											}
										})
									}
								}
							);
							promises.push(csvParser.data(id)
								.then(function(data){
									result = result.concat(data)
								})
							)
						})
					}
					return Promise.all(promises).then(function(resolve){
						// console.log("promises", promises)
						return result
					});
				// })	
			}
				

		});

	 return new Promise(function(resolve){
			parser.validate()
					.then(function(validation){
						product.validation = validation;
						if (!validation.error){
							parser.metadata()
								.then(function(metadata){
									product.metadata = metadata;
									parser.data()
										.then(function(data){
											product.data =  data;
											parser.dictionary()
												.then(function(dict){
													product.dictionary = dict;
													// var coder = Coder();
													// for(var d in product.metadata.dimension){
													// 	coder.push(product.metadata.dimension[d].values.map(function(t){return t.id}))
													// 	coder.push(product.metadata.dimension[d].values.map(function(t){return t.label}))
													// }

													// product.dictionary = product.dictionary.concat(coder.dictionary());

													// for(var d in product.metadata.dimension){
													// 	product.metadata.dimension[d].values = 
													// 		product.metadata.dimension[d].values.map(function(d){
													// 			return {
													// 				id:coder.encode(d.id),
													// 				label:coder.encode(d.label)
													// 			}
													// 		}) 
													// }

													// product.data = product.data.map(function(row){
													// 	var r = {}
													// 	for(var key in row){
													// 		r[key] = coder.encode(row[key])
													// 	}
													// 	return r;
													// })	

													// console.log(product);
													parser.i18n()
														.then(function(dict){
															product.dictionary = product.dictionary.concat(dict);
															// console.log(product);
															product = aggregate(product)
															resolve(product);	
														})
												})
										})
								})
						}else{
							resolve(undefined);
						}
					})
	})				
	
}	 					