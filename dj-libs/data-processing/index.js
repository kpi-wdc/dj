// data processing implementation
// 

var Promise = require("bluebird");

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
		line			: "line"
}

var executionMap = {
		reduce 			: require("./table/reduce-nulls"),
		order 			: require("./table/order"),
		aggregate 		: require("./table/aggregate"),
		transpose 		: require("./table/transpose"), 
		limit 			: require("./table/limit"),
		reduceMeta		: require("./table/reduce-meta"),
		format 			: require("./table/format"),
		join 			: require("./table/join"),
		merge 			: require("./table/merge"),

		norm 			: require("./stat/norm"),
		pca 			: require("./stat/pca"),
		cluster 		: require("./stat/kmeans"),
		hist 			: require("./stat/hist"),
		corr 			: require("./stat/corr"),
		rank 			: require("./stat/rank"),
		imput 			: require("./stat/imput"),

		query 			: require("./dataset/query"),

		bar				: require("./serie/bar"),
		deps			: require("./serie/deps"),
		geojson			: require("./serie/geojson"),
		scatter			: require("./serie/scatter"),
		line			: require("./serie/line")
}

var getProcess = function(params){
	var processId;
	if(params.useColumnMetadata) processId = "reduceMeta";
	if(params.useRowMetadata) processId =  "reduceMeta";
	if(params.reduce) processId =  "reduce";
	if(params.normalization) processId = "norm";
	if(params.precision) processId = "format";
	if(params.transpose) processId =  "transpose";
	if(params.order) processId =  "order";
	if(params.aggregation) processId =  "aggregate";
	if(params.rank) processId =  "rank";
	if(params.histogram) processId =  "hist";
	if(params.correlation) processId =  "corr";
	if(params.limit) processId =  "limit";
	if(params.cluster) processId =  "cluster";
	if(params.pca) processId =  "pca";
	if(params.inputation) processId =  "imput";
	if(params.join) processId =  "join";
	if(params.merge) processId =  "merge";
	if(params.query) processId =  "query";
	
	if(params.serie) processId =  params.serie;

	// console.log("process",params,processId)
	if(processId) return executionMap[processId]
	return undefined;
	
}

var executeStep = function (data, params){
	// console.log("execute", JSON.stringify(params))
	var process, p, key;
	if(params.processId){
		process = executionMap[params.processId];
		p = params.settings;
		key = typeMap[params.processId];
	}else{
		var processId = getProcess(params);
		process = executionMap[processId];
		p = params;
		key = typeMap[params.processId] 
	}
	
	if(process) return { table:	process(data.table,p), key: key }

	return data;
}	
	



module.exports = function(data,params,sails){
	console.log("SAILS PPPP", arguments)
	return new Promise(function(resolve){
		var script = (params.script) ? (params.script.forEach) ? params.script: [params.script] : [params];
		var currentData = data;
		script.forEach(function(operation){
			currentData = executeStep(currentData, operation)
		})
		currentData.postProcess = script;
		resolve(currentData);
	})
}



// 
// process(table,script).then(function(result){// handle post process result})