// Script for data processing
// 

var Promise = require("bluebird");
var Cache = require("./Cache");
var logger = require("../../wdc_libs/wdc-log").global;
var scriptParser = require("../../wdc_libs/data-processing/script/parser");
var I18N = require("../../wdc_libs/wdc-i18n");


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
    data: d.value,
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


var metaImpl = function(data, params, locale, script){
	return new Promise(function(resolve,reject){
		Dataset.find({"commit/HEAD": true})
       	.then(function(datasets){
       		datasets = datasets.map(function(item){return item.metadata})
       		Dictionary.find({})
	          .then(function(json){
	    		i18n = new I18N(json);
	            Promise.reduce(datasets, function(c,dataset){
	            	return new Promise(function(resolve){
	            		dataset = i18n.translate(dataset,locale);
		                for(i in dataset.dimension){
			              dataset.dimension[i].values = 
			              i18n.translate(dataset.dimension[i].values,locale)  
			              dataset.dimension[i].label = i18n.translate(dataset.dimension[i].label,locale);
			            } 
		        		resolve()	
	            	})
	           },0).then(function(){resolve(datasets)})
	    	})	
       	})
    })   		
}

var dictImpl = function(data, params, locale, script){
	return new Promise(function(resolve,reject){
		Dictionary.find({})
	          .then(function(result){
	          	resolve(result)
	          })	
	})
}

var countImpl = function(data, params, locale, script){
	return new Promise(function(resolve,reject){
			resolve(data.length)
	})
}	

var translateImpl = function(data, params, locale, script){
	var dict = {}
	function _lookup(o){
		if(util.isObject(o)){
			for(var key in o){
				o[key] = _lookup(o[key])
			}
			return o
		}
		if(util.isArray(o)){
			return o.map(function(item){return _lookup(item)})
		}
		if(util.isString(o)){
			return (dict[o] && dict[o][locale])? dict[o][locale] : o
		}	
		return o;
	}

	return new Promise(function(resolve){
      Dictionary.find({type:"i18n"})
            .then(function(json){
              json.forEach(function(item){
              	dict[item.key] = item.value;
              })
              obj = _lookup(data);
              resolve(obj);
            })
      }) 
}

var lookupImpl = function(data, params, locale, script){

	var dict = {}

	function _lookup(o){
		if(util.isObject(o)){
			for(var key in o){
				o[key] = _lookup(o[key])
			}
			return o
		}
		if(util.isArray(o)){
			return o.map(function(item){return _lookup(item)})
		}
		if(util.isString(o)){
			return (dict[o])? dict[o] : o
		}	
		return o;
	}


	return new Promise(function(resolve){
      Dictionary.find({})
            .then(function(json){
              json.forEach(function(item){
              	dict[item.key] = item.value;
              })
              var res = _lookup(data)
              resolve(res);
            })
      }) 
}


var versionImpl = function(){
	return {name: "DJ Data Processing Script", version:"0.1"}
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
		source			: "json",
		save 			: "json",

		jspath			: "json",
		meta 			: "json",
		dict			: "json",
		count 			: "json",
		i18n 			: "json",
		lookup 			: "json",
		ver 			: "json",
		get 			: "json",
		put 			: "json"

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
		
		jspath			: require("../../wdc_libs/data-processing/serie/jspath"),

		put			: require("../../wdc_libs/data-processing/variable/set.js"),
		get			: require("../../wdc_libs/data-processing/variable/get.js"),
		
		

		source			: sourceImpl,
		save 			: saveImpl,
		meta 			: metaImpl,
		dict 			: dictImpl,
		count 			: countImpl,
		i18n 			: translateImpl,
		lookup 			: lookupImpl,
		ver 			: versionImpl
}

var executeStep = function (data, params, locale, script, scriptContext){
	var process, p, key;
	var get = require("../../wdc_libs/data-processing/variable/get.js")

	var applyContext = function(o,c){
		if(util.isObject(o)){
			for(var key in o){
				o[key] = applyContext(o[key])
			}
			return o
		}
		if(util.isArray(o)){
			return o.map(function(item){return applyContext(item)})
		}
		if(util.isString(o)){
			if(o.match(/\{\{[\s\S]*\}\}/gi)){
				var key = o.substring(2,o.length-2);
				console.log("apply "+key)
				return get(undefined,{path:key}, undefined, undefined, scriptContext)

			}else{
				return o
			}	
		}	
		return o;
	}
	
	return new Promise(function(resolve,reject){
		if(params.processId){
			process = executionMap[params.processId];
			p = params.settings;
			p = applyContext(p,scriptContext);
			key = typeMap[params.processId];
			key = (key == 'source')? (params.settings.dataset)? "dataset" : "table" : key
		}
		if(process){
			var res = process(((data) ? data.table : undefined), p, locale, script, scriptContext);
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
		var scriptContext = {};

		Promise.reduce(scriptParser.parse(script), function(currentData, operation, index){
			return new Promise(function(resolve){
				executeStep(currentData, operation, locale, script, scriptContext)
					.then(function(res){
						currentData = res;
						resolve(currentData);		
					})
				
			})	
		},0).then(function(result){resolve(result)})	
	})
}

