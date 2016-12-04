var Parser = require("../../wdc-parser");
var Promise = require("bluebird");
var query = require('../../wdc-query');
var util = require("util");
var FO = require("../../wdc-flat");
var date = require('date-and-time');
var logger = require("../../wdc-log").global;


module.exports = function (filename){
	var product = {};

	var parser = new Parser(
		{
			filename : filename,
			
			reader: {
				type: "xlsx"
			},

			validate: function(workbook){
				  var metadataSheet = workbook.Sheets['metadata'];
				  var dictionarySheet = workbook.Sheets['dictionary'];
				  var i18nSheet = workbook.Sheets['i18n'];
				  var warnings =[];

				  if(!metadataSheet){ 
				  	logger.error("Cannot find metadata. Metadata sheet must be named 'metadata'")
				  	return {error:"Cannot find metadata. Metadata sheet must be named 'metadata'"}
				  }
				  	
				  var metadata = FO.flat2json(
				      new query()
				        .from(metadataSheet)
				        .map(function (item) {
				          return {path: item.key, value: item.value}
				        })
				        .get());
				  
				  if(!metadata.dataset.id || metadata.dataset.id ==''){
				 	  logger.error("Cannot find metadata.dataset.id. Create and download new dataset with dataset manager'")
				  	  return {error:"Cannot find metadata.dataset.id. Create and download new dataset with dataset manager'"}    
				  }

				  if(!metadata.dataset.commit.note || metadata.dataset.commit.note == ''){
				  	  logger.warn("Metadata.dataset.commit.note is empty");	
				      warnings.push("Metadata.dataset.commit.note is empty");
				  }

				  if(!metadata.dataset.label || metadata.dataset.label == ''){   
				    logger.warn("Dataset.label is empty");
				    warnings.push("Dataset.label is empty");
				  }  

				  if(!metadata.dataset.note || metadata.dataset.note == ''){   
				    logger.warn("Dataset.note is empty")
				    warnings.push("Dataset.note is empty");
				  }  

				  if(!metadata.dataset.source || metadata.dataset.source == ''){   
				    logger.warn("Dataset.source is empty");
				    warnings.push("Dataset.source is empty");
				  }  

				  if(!metadata.dataset.topics || metadata.dataset.topics.length == 0){   
				    logger.warn("List of topics is empty");
				    warnings.push("List of topics is empty");
				  }  

				  if(!metadata.dimension){
				   logger.error("Cannot find dataset dimension.")
				   return {error:"Cannot find dataset dimension."}
				  }    
				  
				  for(var key in metadata.dimension){
				  	if(metadata.dimension[key].role =="time" && !metadata.dimension[key].format){
				  		logger.error("Cannot find format date for "+ key +"dimension");
				        return {error:"Cannot find format date for "+ key +"dimension"}
				  	}
				    
				    if(!metadata.dimension[key].label || metadata.dimension[key].label==''){
				    	logger.error("Cannot find dimension."+ key +".label")
				        return {error:"Cannot find dimension."+ key +".label"}
				    }
				    if(!metadata.dimension[key].role || metadata.dimension[key].role==''){
				    	logger.warn("Cannot find dimension."+ key +".role");
				        warnings.push("Cannot find dimension."+ key +".role");
				    }
				  }
				  
				  if(!metadata.layout || metadata.layout==''){
				  	logger.error("Cannot find metadata.layout");
				  	return {error:"Cannot find metadata.layout"}
				  }	

				  if(!metadata.layout.sheet || !workbook.Sheets[metadata.layout.sheet]){
				  	logger.error("Reference "+metadata.layout.sheet+"to data sheet...")
				    return {error:"Reference "+metadata.layout.sheet+"to data sheet..."} 
				  }  
				  
				  for(var key in metadata.dimension){
				    if(!metadata.layout[key].label || metadata.layout[key].label == ''){
				    	logger.error("Cannot find layout."+ key +".label. It must be refered to data sheet column")
				        return {error:"Cannot find layout."+ key +".label. It must be refered to data sheet column"}
				    }
				    if(!metadata.layout[key].id || metadata.layout[key].id ==''){
				    	logger.warn("Cannot find layout."+ key +".id. It must be refered to data sheet column")
				        warnings.push("Cannot find layout."+ key +".id. It must be refered to data sheet column");
				    }
				  }
				  
				  data = workbook.Sheets[metadata.layout.sheet];

				  if(!metadata.layout.value || metadata.layout.value == ''){ 
				    logger.error("Cannot find layout.value. It must be refered to data sheet column")
				    return {error:"Cannot find layout.value. It must be refered to data sheet column"}
				  }  
				  
				  logger.debug("Find "+ data.length + " records in data sheet")
				  for(var key in metadata.dimension){
				  	var index = 0;
				    data.forEach(function(row,index){
				      if(!row[metadata.layout[key].label]){ 
				        logger.error("Sheet '"+metadata.layout.sheet+"' row "+index+" has undefined value in column '"+metadata.layout[key].label+"'")
				        return {error:"Sheet '"+metadata.layout.sheet+"' row "+index+" has undefined value in column '"+metadata.layout[key].label+"'"}
				      }  
				      if(!row[metadata.layout[key].id]){ 
				        logger.error("Sheet '"+metadata.layout.sheet+"' row "+index+" has undefined value in column '"+metadata.layout[key].id+"'")
				        return {error:"Sheet '"+metadata.layout.sheet+"' row "+index+" has undefined value in column '"+metadata.layout[key].id+"'"}
				      }	
				    })
				    
				  }

				  data.forEach(function(row,index){
				      if(!row[metadata.layout.value]){
				    	index++;
				    	logger.warn("Sheet '"+metadata.layout.sheet+"' row "+index + " has undefined value in column '"+metadata.layout.value+"'")
				        warnings.push("Sheet '"+metadata.layout.sheet+"' row "+index + " has undefined value in column '"+metadata.layout.value+"'") 
				    	}
				  })


				  if (dictionarySheet != undefined) {
				    var dict = workbook.Sheets['dictionary'];
				    dict.forEach(function(row, index){
				    	if(!row.key){
				        logger.error("Sheet 'dictionary' row "+index +" has undefined value in column 'key'")
				        return {error:"Sheet 'dictionary' row "+index +" has undefined value in column 'key'"}
				      }	
				    })
				  }

				if (i18nSheet != undefined) {
				    var dict = workbook.Sheets['i18n'];
				    dict.forEach(function(row, index){
				      if(!row.key){
				        logger.error("Sheet 'dictionary' row "+index +" has undefined value in column 'key'")
				        return {error:"Sheet 'dictionary' row "+index +" has undefined value in column 'key'"}
				      }
				    })	
				  }

				  
				  return {"warnings": warnings}; 
			},

			metadata: function(workbook){
			      var metadataSheet = workbook.Sheets['metadata'];
				  var dictionarySheet = workbook.Sheets['dictionary'];
				  var i18nSheet = workbook.Sheets['i18n'];

				  var metadata, data, dictionary;

				  if (metadataSheet != undefined) {
				    metadata = FO.flat2json(
				      new query()
				        .from(metadataSheet)
				        .map(function (item) {
				          return {path: item.key, value: item.value}
				        })
				        .get());

				    var dims = metadata.dimension;
				    var layout = metadata.layout;
				    var rawData = workbook.Sheets[layout.sheet]

				    if (rawData != undefined) {

				      for (i in dims) {

				        dims[i].values = new query()
				          .from(rawData)
				          .map(function (item) {
				            return {
				              id: item[layout[i].id], 
				              label: (dims[i].role == "time")
				              	? date.parse(item[layout[i].label],dims[i].format)
				              	: item[layout[i].label]
				            }
				          })
				          .distinct()
				          .orderBy(function (a, b) {
				            return a > b
				          })
				          .get();
				      }
				      return metadata;
				    }
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
				var dims = product.metadata.dimension;
			    var layout = product.metadata.layout;
			    var rawData = workbook.Sheets[layout.sheet]
			    var data;
			    if (rawData != undefined) {
			      data = new query()
			        .from(rawData)
			        .map(function (item) {
			          result = {};
			          for (i in dims) {
			            result[i] = (dims[i].role == "time")
				              	? date.parse(item[layout[i].label],dims[i].format)
				              	: item[layout[i].label];
			            result["#" + i] = item[layout[i].id];
			          }
			          result["#value"] = item[layout.value];
			          return result;
			        })
			        .get();
				}
				return data;
			}

		});

	 return new Promise(function(resolve){
			parser.validate()
					.then(function(validation){
						product.validation = validation;
						logger.log("validate");
						if (!validation.error){
							parser.metadata()
								.then(function(metadata){
									product.metadata = metadata;
									logger.log("extract metadata");
									parser.data()
										.then(function(data){
											product.data = data;
											logger.log("parse data");
											parser.dictionary()
												.then(function(dict){
													product.dictionary = dict;
													logger.log("extract dictionary");
													parser.i18n()
														.then(function(dict){
															product.dictionary = product.dictionary.concat(dict);
															logger.log("extract i18n");
															resolve(product);	
														})
												})
										})
								})
						}else{
							resolve(product);
						}
					})
	})				
	
}	 					