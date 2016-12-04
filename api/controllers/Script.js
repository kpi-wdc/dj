// Script for data processing
// 

var Promise = require("bluebird");
var Cache = require("./Cache");
var logger = require("../../wdc_libs/wdc-log").global;
var scriptParser = require("../../wdc_libs/data-processing/script/parser");



var getDataset = function (id,locale){
	return new Promise(function(resolve,reject){
		Dataset.findOne({"dataset/id": id, "commit/HEAD": true})
       	.then(function(dataset){
       		Dictionary.find({})
	          .then(function(json){
	            i18n = new I18N(json);
	            dataset.data = i18n.translate(dataset.data,locale);
	            dataset.metadata = i18n.translate(dataset.metadata,locale);
	          
	            for(i in dataset.metadata.dimension){
	              dataset.metadata.dimension[i].values = 
	              i18n.translate(dataset.metadata.dimension[i].values,locale)  
	              dataset.metadata.dimension[i].label = i18n.translate(dataset.metadata.dimension[i].label,locale);
	            } 
	        	resolve(dataset)    
	          })
       	})	
	})
}

var getTable = function (id){
	return new Promise(function(resolve,reject){
		Cache
        	.getById(id)
        	.then(function(cached){
    	  		resolve(cached.value)
          	})	
	})
}

var sourceImpl = function(data,params, locale){
	if(params.dataset){
		return getDataset(params.dataset, locale)	
	}
	
	if(params.table){
		return getTable(params.table)
	}
	return undefined;
}

var prepareCachedResult = function(d){
  d = (util.isArray(d))? d[0] : d;
  d = d || {};
  return {
    // data: d.value,
    data_id: d.id,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  }
}

var saveImpl = function(data, params, locale, script){
	return new Promise(function(resolve,reject){
		Cache
          .save("process",script,data,{})
          .then(function(result){
            resolve(prepareCachedResult(result))
          })
	})
}

var typeMap = {
		reduce 			: "table",
		order 			: "table",
		aggregate 		: "table",
		transpose 		: "table", 
		limit 			: "table",
		reduceMeta		: "table",
		format 			: "table",
		join 			: "table",
		merge 			: "table",

		norm 			: "table",
		pca 			: "table",
		cluster 		: "table",
		hist 			: "table",
		corr 			: "table",
		rank 			: "table",
		imput 			: "table",

		query 			: "table",

		bar				: "bar",
		deps			: "deps",
		geojson			: "geojson",
		scatter			: "scatter",
		line			: "line",
		source			: "source",
		save 			: "cache"
}

var executionMap = {
		reduce 			: require("../../wdc_libs/data-processing/table/reduce-nulls"),
		order 			: require("../../wdc_libs/data-processing/table/order"),
		aggregate 		: require("../../wdc_libs/data-processing/table/aggregate"),
		transpose 		: require("../../wdc_libs/data-processing/table/transpose"), 
		limit 			: require("../../wdc_libs/data-processing/table/limit"),
		reduceMeta		: require("../../wdc_libs/data-processing/table/reduce-meta"),
		format 			: require("../../wdc_libs/data-processing/table/format"),
		join 			: require("../../wdc_libs/data-processing/table/join"),
		merge 			: require("../../wdc_libs/data-processing/table/merge"),

		norm 			: require("../../wdc_libs/data-processing/stat/norm"),
		pca 			: require("../../wdc_libs/data-processing/stat/pca"),
		cluster 		: require("../../wdc_libs/data-processing/stat/kmeans"),
		hist 			: require("../../wdc_libs/data-processing/stat/hist"),
		corr 			: require("../../wdc_libs/data-processing/stat/corr"),
		rank 			: require("../../wdc_libs/data-processing/stat/rank"),
		imput 			: require("../../wdc_libs/data-processing/stat/imput"),

		query 			: require("../../wdc_libs/data-processing/dataset/query"),

		bar				: require("../../wdc_libs/data-processing/serie/bar"),
		deps			: require("../../wdc_libs/data-processing/serie/deps"),
		geojson			: require("../../wdc_libs/data-processing/serie/geojson"),
		scatter			: require("../../wdc_libs/data-processing/serie/scatter"),
		line			: require("../../wdc_libs/data-processing/serie/line"),
		
		source			: sourceImpl,
		save 			: saveImpl
}

// var getProcess = function(params){
// 	var processId;
// 	if(params.useColumnMetadata) processId = "reduceMeta";
// 	if(params.useRowMetadata) processId =  "reduceMeta";
// 	if(params.reduce) processId =  "reduce";
// 	if(params.normalization) processId = "norm";
// 	if(params.precision) processId = "format";
// 	if(params.transpose) processId =  "transpose";
// 	if(params.order) processId =  "order";
// 	if(params.aggregation) processId =  "aggregate";
// 	if(params.rank) processId =  "rank";
// 	if(params.histogram) processId =  "hist";
// 	if(params.correlation) processId =  "corr";
// 	if(params.limit) processId =  "limit";
// 	if(params.cluster) processId =  "cluster";
// 	if(params.pca) processId =  "pca";
// 	if(params.inputation) processId =  "imput";
// 	if(params.join) processId =  "join";
// 	if(params.merge) processId =  "merge";
// 	if(params.query) processId =  "query";
	
// 	if(params.serie) processId =  params.serie;
// 	if(processId) return executionMap[processId]
// 	return undefined;
	
// }

var executeStep = function (data, params, locale, script){
	var process, p, key;
	return new Promise(function(resolve,reject){
		if(params.processId){
			process = executionMap[params.processId];
			p = params.settings;
			key = typeMap[params.processId];
			key = (key == 'source')? (params.settings.dataset)? "dataset" : "table" : key
		}
		if(process){
			var res = process(((data) ? data.table : undefined), p, locale, script);
			if(res.then){
				res.then(function(r){
					resolve( { table:r, key: key } )
				})
			}else{
				resolve( { table:res, key: key })
			}
		}else{
			resolve(data)
		}	
	})
}	
	



module.exports = function(script,locale){
	logger.debug("Run script "+JSON.stringify(script))



	return new Promise(function(resolve){
		var currentData;
		Promise.reduce(scriptParser.parse(script), function(currentData, operation, index){
			return new Promise(function(resolve){
				executeStep(currentData, operation, locale, script)
					.then(function(res){
						currentData = res;
						resolve(currentData);		
					})
				
			})	
		},0).then(function(result){resolve(result)})	
	})
}

