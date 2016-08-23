var Parser = require("../../wdc-parser");
var Promise = require("bluebird");
var query = require('../../wdc-query');
var util = require("util");
var FO = require("../../wdc-flat");
var date = require('date-and-time');
var copyObject = require('copy-object');


var rst = [];


var toChidlist = function(data){
	var result = []

	for(var i in data){
		result.push(copyObject(data[i]))
		for(var j in data[i]){
			if(["type","start","end","category","context","childs"].indexOf(j) >= 0) 	
				delete data[i][j]
		}

		rst.push(result);
		var childs = toChidlist(data[i])
		result = rst.pop();

		if(childs.length > 0){
			result[result.length-1].childs = childs;
		}
		

		for(var j in result[result.length-1]){
		 	if(["type","start","end","category","context","childs"].indexOf(j) < 0) 
		 		delete result[result.length-1][j]
		 } 
		
	}
	return result;
}

var domain = function(events){
	var tmp =[];
	events.forEach(function(event){
		if(event.type == "flow"){
			var d = domain(event.childs)
			event.start = d[0];
			event.end = d[1] 
		}
		if(event.type == "instant"){
			event.end = event.start
		}

		if(event.start) tmp.push(event.start);
		if(event.end) tmp.push(event.end);
	})

	tmp = tmp.sort(function(a,b){
		return date.subtract(a, b).toMilliseconds()
	})
	return [tmp[0],tmp[tmp.length-1]]
}

var inputDate = function(data){
	domain(data);
	return data;
}

 var _line = [];

  var createLine = function(data){
    data.forEach(function(d){
      _line.push(d)
      if(d.children) createLine(d.children)
    })
  }
  
  var index = 0;
  var insertId = function(data){
    data.forEach(function(d,i){
      d.id = line[index].id;
      index++;
      if(d.children) insertId(d.children)
    }) 
  }

module.exports = function (filename){
	var product = {};

	var parser = new Parser(
		{
			filename : filename,
			
			reader: {
				type: "xlsx"
			},

			validate: function(workbook){
				// console.log("validate")
				//   var metadataSheet = workbook.Sheets['metadata'];
				//   var dictionarySheet = workbook.Sheets['dictionary'];
				//   var i18nSheet = workbook.Sheets['i18n'];
				//   var warnings =[];

				//   if(!metadataSheet) 
				//   	return {error:"Cannot find metadata. Metadata sheet must be named 'metadata'"}

				//   var metadata = FO.flat2json(
				//       new query()
				//         .from(metadataSheet)
				//         .map(function (item) {
				//           return {path: item.key, value: item.value}
				//         })
				//         .get());
				  
				//   if(!metadata.dataset.id || metadata.dataset.id =='')
				//       return {error:"Cannot find metadata.dataset.id. Create and download new dataset with dataset manager'"}    

				//   if(!metadata.dataset.commit.note || metadata.dataset.commit.note == '')
				//       warnings.push("Metadata.dataset.commit.note is empty");

				//   if(!metadata.dataset.label || metadata.dataset.label == '')   
				//     warnings.push("Dataset.label is empty");

				//   if(!metadata.dataset.note || metadata.dataset.note == '')   
				//     warnings.push("Dataset.note is empty");

				//   if(!metadata.dataset.source || metadata.dataset.source == '')   
				//     warnings.push("Dataset.source is empty");

				//   if(!metadata.dataset.topics || metadata.dataset.topics.length == 0)   
				//     warnings.push("List of topics is empty");

				//   if(!metadata.dimension) return {error:"Cannot find dataset dimension."}   
				  
				//   for(var key in metadata.dimension){
				//     if(!metadata.dimension[key].label || metadata.dimension[key].label=='')
				//         return {error:"Cannot find dimension."+ key +".label"}
				//     if(!metadata.dimension[key].role || metadata.dimension[key].role=='')
				//         warnings.push("Cannot find dimension."+ key +".role");
				//   }
				  
				//   if(!metadata.layout || metadata.layout=='') 
				//   	return {error:"Cannot find metadata.layout"}

				//   if(!metadata.layout.sheet || !workbook.Sheets[metadata.layout.sheet]) 
				//     return {error:"Reference "+metadata.layout.sheet+"to data sheet..."} 

				//   for(var key in metadata.dimension){
				//     if(!metadata.layout[key].label || metadata.layout[key].label == '')
				//         return {error:"Cannot find layout."+ key +".label. It must be refered to data sheet column"}
				//     if(!metadata.layout[key].id || metadata.layout[key].id =='')
				//         warnings.push("Cannot find layout."+ key +".id. It must be refered to data sheet column");
				//   }
				  
				//   data = workbook.Sheets[metadata.layout.sheet];

				//   if(!metadata.layout.value || metadata.layout.value == '') 
				//     return {error:"Cannot find layout.value. It must be refered to data sheet column"}
				  
				//   for(var key in metadata.dimension){
				//     for(var row in data){
				//       if(!data[row][metadata.layout[key].label]) 
				//         return {error:"Sheet '"+metadata.layout.sheet+"' row "+row+" has undefined value in column '"+metadata.layout[key].label+"'"}
				//       if(!data[row][metadata.layout[key].id]) 
				//         return {error:"Sheet '"+metadata.layout.sheet+"' row "+row+" has undefined value in column '"+metadata.layout[key].id+"'"}
				//     }
				//   }

				//   for(var row in data){
				//     if(!data[row][metadata.layout.value])
				//         warnings.push("Sheet '"+metadata.layout.sheet+"' row "+row + " has undefined value in column '"+metadata.layout.value+"'") 
				//   }


				//   if (dictionarySheet != undefined) {
				//     var dict = workbook.Sheets['dictionary'];
				//     for(var i in dict){
				//       if(!dict[i].key)
				//         return {error:"Sheet 'dictionary' row "+i +" has undefined value in column 'key'"}
				//       if(!dict[i]["value.label"])
				//         return {error:"Sheet 'dictionary' row "+i +" has undefined value in column 'value.label'"}
				//     }
				//   }

				// if (i18nSheet != undefined) {
				//     var dict = workbook.Sheets['i18n'];
				//     for(var i in dict){
				//       if(!dict[i].key)
				//         return {error:"Sheet 'i18n' row "+i +" has undefined value in column 'key'"}
				//     }
				//   }

				  
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
			// console.log("dictionary")
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
				// console.log("i18n")
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
				var metadata =  product.metadata;
				// console.log(metadata)
				var rawData = workbook.Sheets[metadata.layout.sheet];

				var categories = new query()
					.from(rawData)
					.map(function(item){return item.category})
					.distinct()
					.get();
				var data = [];	
				// categories.forEach(function(cat){
				// 	data.push({
				// 		category : cat,
				// 		values :
				// 			inputDate(
				// 				toChidlist(
				// 					FO.flat2json(
				// 				      new query()
				// 				        .from(rawData)
				// 				        .select(function(item){
				// 				        	return item.category == cat
				// 				        })
				// 				        .map(function (item) {
				// 				          return {path: item[metadata.layout.hierarhy], value: 
				// 				          	{
				// 					          	type: item[metadata.layout.type],
				// 					          	start: (item[metadata.layout.start]) 
				// 					          		? date.parse(item[metadata.layout.start], metadata.layout.dateFormat)
				// 					          		: undefined,
				// 					          	end: (item[metadata.layout.end]) ? 
				// 					          		date.parse(item[metadata.layout.end], metadata.layout.dateFormat)
				// 					          		: undefined,
				// 					          	category: item[metadata.layout.category],
				// 					          	context: item[metadata.layout.context]
				// 					          }
				// 					      }
				// 					     })
				// 				        .get()
				// 				    )
				// 				)
				// 			)	
				// 	})
				// })	

				var data = FO.flat2json(
				      new query()
				        .from(rawData)
				        .map(function (item) {
				        	// console.log(item)
				          return {path: item[metadata.layout.hierarhy], value: {
				          	type: item[metadata.layout.type],
				          	start: (item[metadata.layout.start]) 
				          		? date.parse(item[metadata.layout.start], metadata.layout.dateFormat)
				          		: undefined,
				          	end: (item[metadata.layout.end]) ? 
				          		date.parse(item[metadata.layout.end], metadata.layout.dateFormat)
				          		: undefined,
				          	category: item[metadata.layout.category],
				          	context: item[metadata.layout.context]
				          }}
				        })
				        .get());
				
				data = toChidlist(data);
				var d = domain(data);
				createLine(data)

				var result = {
					// line : _line,
					domain : d,
					series : []
				}

				categories.forEach(function(cat){
					result.series.push({
						category : cat,
						values : new query()
							.from(data)
							.select(function(item){
								return item.category == cat
							})
							.orderBy(function(a,b){
								return date.subtract(a.start, b.start).toMilliseconds()
							})
							.get()
					})
				})			
			
				return result;

				// console.log("data")
				// var dims = product.metadata.dimension;
			 //    var layout = product.metadata.layout;
			 //    var rawData = workbook.Sheets[layout.sheet]
			 //    var data;
			 //    if (rawData != undefined) {
			 //      data = new query()
			 //        .from(rawData)
			 //        .map(function (item) {
			 //          result = {};
			 //          for (i in dims) {
			 //            result[i] = (dims[i].role == "time")
				//               	? date.parse(item[layout[i].label],dims[i].format)
				//               	: item[layout[i].label];
			 //            result["#" + i] = item[layout[i].id];
			 //          }
			 //          result["#value"] = item[layout.value];
			 //          return result;
			 //        })
			 //        .get();
				// }
				// return data;
				// return {}	
			}

		});

// console.log("parse")

	 return new Promise(function(resolve){
			parser.validate()
					.then(function(validation){
						product.validation = validation;
						if (!validation.error){
							parser.metadata()
								.then(function(metadata){
									product.metadata = metadata;
									// console.log(product);
									parser.data()
										.then(function(data){
											product.data = data;
											// console.log(product);
											parser.dictionary()
												.then(function(dict){
													product.dictionary = dict;
													// console.log(product);
													parser.i18n()
														.then(function(dict){
															product.dictionary = product.dictionary.concat(dict);
															// console.log(product);
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