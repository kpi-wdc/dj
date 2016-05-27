var Query = require("../../wdc_libs/wdc-query"),
	STAT = require("./lib/stat"),
	PCA = require("./lib/pca").PCA,
	CLUSTER = require("./lib/cluster").CLUSTER,
	UTIL = require("util");
	require('string-natural-compare');

	
var concatLabels = function(list,usage){
	var result = "";
	var data;
	if( usage == null || usage == undefined || (usage.length && usage.length == 0)){
		data = list
	}else{
		data = list
				.filter(function(item,index){
					return usage[index];
				});
	}
	
	data.forEach(function(item,index){

		result += item.label;
		result += (index < list.length-1) ? ", " : "";
	})
	return result;
}

exports.FormatValues = function(table,params){
	if( params.precision != undefined && params.precision != null){
		table.body.forEach(function(currentRow){
			currentRow.value = currentRow.value.map(function(item){
				return (item == null) ? null : new Number(item.toFixed(params.precision))
			})
		})
	}
	return table;
}


exports.dependencySerie = function(table,params){
	return table.body.map(function(row){
		var serie = {
			key: row.metadata.map(function(item){ return item.label}).join(", "),
			values: row.value.map(function(item,index){
				return {
					label:table.header[index].metadata.map(function(item){ return item.label}).join(", "),
					value:item
				}
			})
		}
		return serie;
	})
}

exports.CorrelationMatrix = function(table,params){
	return exports.dependencySerie(table,params);


	
	// var series = exports.BarChartSerie(table);
	// series.forEach(function(item){
	// 	item.values = item.values.map(function (current) {
 //          return current.value;
 //        });
	// });
	// var result = [];
 //      for (var i = 0; i < series.length; i++) {
 //        var row = [];
 //        for (var j = 0; j < series.length; j++) {
 //          row.push({ label: series[j].key, value: STAT.corr(series[i].values, series[j].values) });
 //        }
 //        result.push({ key: series[i].key, values: row });
 //      }
	// return result;
};

exports.CorrelationTable = function (table,params) {
      var matrix = exports.CorrelationMatrix(table);
      var result = {};

      result.body = matrix.map(function (item) {
        var current = {};
        for (i in item.values) {
          current[item.values[i].label] = item.values[i].value;
        }
        return { label: item.key, values: current };
      });

      result.body.sort(function (a, b) {
        return a.label > b.label ? 1 : -1;
      });

      result.header = {};
      result.header.label = table.label;
      result.header.body = {};
      for (var i in result.body[0].values) {
        result.header.body[i] = {};
        result.header.body[i].label = i;
        result.header.body[i].title = i;
      }
      return result;
};


function getRange(row) {
	  var values = [];
	  for (var j in row) {
	    values.push(row[j]);
	  }
	  return {
	    max: STAT.max(values),
	    min: STAT.min(values)
	  };
};

exports.MapSerie = function (table, grad) {
  var result = [];
  for (var i in table.body) {
    var v = [];
    var range = this.getRange(table.body[i].values);

    for (var j in table.body[i].values) {
      var cat;
      if (!isNaN(table.body[i].values[j])) {
        cat = Math.floor((table.body[i].values[j] - range.min) / (range.max - range.min) * grad);
        cat = cat >= grad ? grad - 1 : cat;
      }
      v.push({
        label: j,
        value: table.body[i].values[j],
        id: table.header.body[j].id,
        category: table.body[i].values[j] == null ? undefined : cat
      });
    }
    var boundaries = [];
    for (var k = 0; k <= grad; k++) {
      boundaries.push((range.min + k * (range.max - range.min) / grad).toPrecision(3));
    }

    result.push({
      key: table.body[i].label,
      cats: scope.widget.decoration.color.length,
      range: range,
      boundaries: boundaries,
      values: v });
  }
   return result;
};


exports.Normalize = function (table, params) {
  if(!params.normalization) return table;
  if(!params.normalization.enable) return table;


  var normalizeMode = params.normalization.mode || "Range to [0,1]"; 
  var normalizeArea = params.normalization.direction || "Columns";
  var precision = params.normalization.precision || null;

  var metaSuffix = "";

  // var metaSuffix = " $";
  // 	metaSuffix += (normalizeMode == "Range to [0,1]") 
  // 		? "Range."
  // 		:(normalizeMode == "Standartization")
  // 			? "St."
  // 			: "Log.";
  // metaSuffix += (normalizeArea == "Rows") ? "Row" : "Col";			
  if(normalizeArea == "Columns"){
  		table = exports.transposeTable(table,{transpose:true});
  }

  // if(normalizeArea == "Columns"){
  // 	table.header.forEach(function(currentColumn,columnIndex){
  // 		var data = table.body.map(function(currentRow){
  // 			return currentRow.value[columnIndex];
  // 		});
  // 		switch (normalizeMode) {
  //           case "Range to [0,1]":
  //             data = STAT.normalize(data);
  //             break;
  //           case "Standartization":
  //             data = STAT.standardize(data);
  //             break;
  //           case "Logistic":
  //             data = STAT.logNormalize(data);
  //             break;
  //         }
  //         data.forEach(function(currentValue,rowIndex){
  //         	table.body[rowIndex].value[columnIndex] = (currentValue == null) ? null 
  //         	: (precision !=null) ? new Number (Number(currentValue).toFixed(precision)) : currentValue; 
  //         })
  // 	})
  // 	return table;
  // }

  // if(normalizeArea == "Rows"){
  	table.body.forEach(function(currentRow){
  		switch (normalizeMode) {
            case "Range to [0,1]":
              currentRow.value = STAT.normalize(currentRow.value);
              break;
            case "Standartization":
              currentRow.value = STAT.standardize(currentRow.value);
              break;
            case "Logistic":
              currentRow.value = STAT.logNormalize(currentRow.value);
              break;
          };
          currentRow.value = currentRow.value.map(function(currentValue){
          	return (currentValue == null) ? null : 
          	(precision != null) ? new Number (Number(currentValue).toPrecision(precision)) : currentValue;
          })
  	})
  	table.body.forEach(function(col){
  		col.metadata[col.metadata.length-1].id += metaSuffix;
  		col.metadata[col.metadata.length-1].label += metaSuffix;
  	})

  	if(normalizeArea == "Columns"){
  		table = exports.transposeTable(table,{transpose:true});
  	}
  	return table;
  // }

}




exports.ReduceNull = function(table,params){
	if(!params.reduce) return table;
	if(!params.reduce.enable) return table;
	var direction = params.reduce.direction || "Rows"; // "Columns"
	var mode = params.reduce.mode || "Has Null"; // "All Nulls"

	
	var	hasNull = function(data){
		var result = false;
		data.forEach(function(item){
			if (item == null || isNaN(new Number(item))){
				result = true;
			}
		});
		return result;
	};
	
	var	allNulls = function(data){
		var result = 0;
		data.forEach(function(item){
			if (item == null || isNaN(new Number(item))){
				result++
			}
		});
		return result == data.length;
	}

	var criteria = (mode == "All Nulls") ? allNulls : hasNull;

	if(direction == "Rows"){
		for(var rowIndex = 0; rowIndex < table.body.length;){
			if(criteria(table.body[rowIndex].value)){
				table.body.splice(rowIndex,1);
			}else{
				rowIndex++;
			}
		}
		
		return table;
	}

	if(direction == "Columns"){
		for(var columnIndex = 0; columnIndex < table.header.length;){
			var data = table.body.map(function(currentRow){
	  			return currentRow.value[columnIndex];
	  		});
			if(criteria(data)){
				table.header.splice(columnIndex,1);
				table.body.forEach(function (currentRow){
					currentRow.value.splice(columnIndex,1)	
				})
			}else{
				columnIndex++;
			}
		}
		table.reduced = true;
		return table;	
	}
	
}


exports.orderTable = function(table,params){
	
	if(!params.order.enable) return table;

	var direction = (params.order.direction) ? params.order.direction : "Rows";//"Columns"
	var asc = (params.order.asc) ? params.order.asc : "A-Z"; //"Z-A"
	var index = (params.order.index) ? params.order.index : 0;


	// String.alphbet = 
			// "0123456789"
		// +	"ABCDEFGH"
		// +	"АБВГҐДЕЄЁЖЗИ"
		// // +	"JKLMNOPQRSTUVWXYZ"
		// 	"abcdefgh"
		// +	"бвагґдеєёжзи"
		// +	"ijklmnopqrstuvwxyz"
		// // +	"ЇЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
		// +	"іїйклмнопрстуфхцчшщъыьэюя";
	
	if(direction == "Columns") table = exports.transposeTable(table,{transpose:true});

	
	table.body.sort(function(a,b){
		if(index<0){
			var j = -index-1;
			if (asc == "Z-A"){
				return (!isNaN(new Number(a.metadata[j].label)) 
					    && !isNaN(new Number(b.metadata[j].label)))
					? b.metadata[j].label - a.metadata[j].label
					: String.naturalCompare(b.metadata[j].label.toLowerCase(),a.metadata[j].label.toLowerCase())
			}

			if (asc == "A-Z"){
				return (!isNaN(new Number(a.metadata[j].label)) 
					    && !isNaN(new Number(b.metadata[j].label)))
					? a.metadata[j].label - b.metadata[j].label
					: String.naturalCompare(a.metadata[j].label.toLowerCase(),b.metadata[j].label.toLowerCase())
			}			 
		}else{
			var j = index;
			if (asc == "Z-A"){
				return (!isNaN(new Number(a.value[j])) 
					    && !isNaN(new Number(b.value[j])))
					? b.value[j] - a.value[j]
					: String.naturalCompare(b.value[j].toLowerCase(), a.value[j].toLowerCase())
			}

			if (asc == "A-Z"){
				return (!isNaN(new Number(a.value[j])) 
					    && !isNaN(new Number(b.value[j])))
					? a.value[j] - b.value[j]
					: String.naturalCompare(a.value[j].toLowerCase(),b.value[j].toLowerCase())
			}
		}
		
	})

	if(direction == "Columns") table = exports.transposeTable(table,{transpose:true});

	return table;

}


exports.transposeTable = function(table,params){
	if (!params.transpose) return table;
	var tBody = table.header;
	var values = [];
	table.body.forEach(function(row){
		values.push(row.value)
	})

	// table.inValues = values;


	tValues = [];
	for(var i=0; i < values[0].length; i++){
		tValues.push(
			values.map(function(item){
				return item[i]
			})
		)
	}

	var tHeader = table.body;
	tHeader.forEach(function(item){
		item.value = undefined;
	})
	// .map(function(item){
	// 	return item.metadata;
	// });
	tBody.forEach(function(item,index){
		item.value = tValues[index]
	})

	table.body = tBody;
	table.header = tHeader;
	
	// table.trValues = tValues;


	return table;	 

}


exports.inputation = function(table, params){
	if(!params.inputation) return table;
	if(!params.inputation.enable) return table;

	var direction = (params.inputation.direction) ? params.inputation.direction : "Rows";//"Columns"
	var from = (params.inputation.from) ? params.inputation.from : "left"; //"right"
	var mode = (params.inputation.mode) ? params.inputation.mode : "fill"; //"mean","fit", ... etc

	if(direction == "Columns") table = exports.transposeTable(table,{transpose:true});

	table.body.forEach(function(row){
		if( mode == "fill" ){
			if (from == "left"){
				var leftValue = row.value[0];
				row.value = row.value.map(function(v){
					if(v == null) return leftValue
					leftValue = v;
					return v;	
				})
				
				// input current value as left value 
			} else {
				// input current value as right value 
			}
		}
		if( mode == "mean" ){
			// input current value as mean between left and right
		}
		if (mode == "fit"){
			// input current value as fitted value between left and right
		}
	})

	if(direction == "Columns") table = exports.transposeTable(table,{transpose:true});

	return table;
}

// exports.addNumbers= function(table,params){
// 	if(!params.numbers) return table;
// 	if(!params.numbers.enable) return table;

// 	if(params.numbers.direction == "Columns") table = table.transposeTable(table,{transpose:true});
	
// 	table.body.forEach(function(row,index){
// 		row.metadata.push({
// 			{id: (index+1), label: (index+1), dimension: "number", dimensionLabel: "number"}
// 		})
// 	})

// 	if(params.numbers.direction == "Columns") table = table.transposeTable(table,{transpose:true});

// 	return table;

// }

// params = {

// rank:{
// 	enable:false,
// 	direction:"Rows",
// 	asc:"A-Z",
// 	indexes:[]
// }



exports.addRanks = function(table,params){
	if(!params.rank) return table;
	if(!params.rank.enable) return table;
	
	var rank = params.rank;
	if(rank.direction == "Columns") table = exports.transposeTable(table,{transpose:true});
	
	var b = [];



	table.body.forEach(function(row,index){

		var foundedIndex = (function(num,list){
			return list.filter(function(item){return item == num})[0]
		})(index,rank.indexes)
		
		if(foundedIndex >= 0){
			var rankList = STAT.rank(row.value);
			if(rank.asc == "Z-A"){
				var max = STAT.max(rankList);
				rankList = rankList.map(function(item){return max+1-item})
			}
			var rankRow = {
				metadata:row.metadata.map(function(item){return item}),
				value: rankList
			}

			rankRow.metadata.push({
				dimension:"type",
				dimensionLabel:"Type",
				id:"rank",
				label:"Rank"
			}) 
			b.push(rankRow)
		}
		row.metadata.push({
			dimension:"type",
			dimensionLabel:"Type",
			id:"value",
			label:"Value"
		})
		b.push(row);

	})


	table.body = b;

	if(rank.direction == "Columns") table = exports.transposeTable(table,{transpose:true});
	return table;
}



exports.addAggregations = function(table,params){

// 	aggregation:{
// 		enable:true,
// 		direction:"Rows",
// 		data:["max","min","avg","std","sum"]
// 	}



	if(!params.aggregation) return table;
	if(!params.aggregation.enable) return table;
	
	var aggregation = params.aggregation;

	if(aggregation.direction == "Columns") table = exports.transposeTable(table,{transpose:true});

	aggregation.data
		.forEach(function(item){
			var hmetaTemplate = table.header[0].metadata
			.map(function(m,index){
				return {
					dimension : m.dimension,
					dimensionLabel : m.dimensionLabel,
					id : "",
					label : ""
				}
			});
			var lastMeta = hmetaTemplate[hmetaTemplate.length-1];
	   		lastMeta.id = item;
			lastMeta.label = item;
			table.header.push({metadata:hmetaTemplate});
		})

	table.body
		.forEach(function(row){
			var v = row.value;
			var additional = [];
			aggregation.data
				.forEach(function(item){
					if(item == "min"){
						additional.push(STAT.min(v))
					}
					if(item == "max"){
						additional.push(STAT.max(v))
					}
					if(item == "avg"){
						additional.push(STAT.mean(v))
					}
					if(item == "std"){
						additional.push(STAT.std(v))
					}
					if(item == "sum"){
						additional.push(STAT.sum(v))
					}
			})
			row.value = row.value.concat(additional);	
		})	
		

	if(aggregation.direction == "Columns") table = exports.transposeTable(table,{transpose:true});
	
	return table;	
}

exports.limit = function(table,params){

	if(!params.limit) return table;
	if(!params.limit.enable) return table;
	
	var limit = params.limit;
	table.body = table.body.filter(function(item,index){
		return ((index+1) >= limit.start) && ((index+1) < (limit.start+limit.length))
	})

	return table;
}

exports.histogram = function(table,params){
	if(!params.histogram) return table;
	if(!params.histogram.enable) return table;
	
	var histogram= params.histogram;

	if(histogram.direction == "Columns") table = exports.transposeTable(table,{transpose:true});
	
	var globalMax = STAT.max(table.body.map(function(row){return STAT.max(row.value)}));
	var globalMin = STAT.min(table.body.map(function(row){return STAT.min(row.value)}));
	
	var histTable = {
		metadata:table.metadata,
		header:[],
		body:[]
	}

	var step = (globalMax - globalMin) / histogram.beans;

	for (var j = 0; j < histogram.beans; j++) {
	  histTable.header.push({ metadata:[{
	  	dimension:"bean",
	  	dimensionLabel:"Bean",
	  	id:((globalMin+(j) * step).toFixed(3)+" - "+ (globalMin+(j+1) * step).toFixed(3)),
	  	label:((globalMin+(j) * step).toFixed(3)+" - "+ (globalMin+(j+1) * step).toFixed(3))
	  }]})
	}

	table.body.forEach(function(row){
		histTable.body.push({

			metadata: row.metadata.map(function(item){return item}),
			value:(
				function(data){
					var h = histTable.header.map(function(item){return 0});
					data.forEach(function(item){
						if(item !=null){
							var index = 
								Math.floor((item - globalMin) / (globalMax - globalMin) * histogram.beans);
							index = (index ==histogram.beans) ? index - 1 : index;
							h[index]++;
						}
					})
					if (histogram.cumulate){
						var s = 0;
						h.forEach(function (val) {
							val.y = s += val.y;
						});
					}
					h = h.map(function(item){return item/data.length})
					return h;
			})(row.value)
		})
	})

	


	// if(histogram.direction == "Columns") table = exports.transposeTable(table,{transpose:true});
	
	return histTable;
}


exports.correlationMatrix = function(table,params){
	if(!params.correlation) return table;
	if(!params.correlation.enable) return table;
	
	var correlation= params.correlation;

	if(correlation.direction == "Columns") table = exports.transposeTable(table,{transpose:true});

	table.header = table.body.map(function(row){return {metadata:row.metadata}});
	var values = [];
	for(var i=0; i<table.body.length; i++){
		var v = [];
		for(var j=0; j<table.body.length; j++){
			v.push(STAT.corr(table.body[i].value,table.body[j].value))
		}
		values.push(v);
	}
	table.body.forEach(function(row,index){
		row.value = values[index]
	})
	
	return table;
}

exports.pca = function(table,params){
	if(!params.pca) return table;
	if(!params.pca.enable) return table;
	var pca= params.pca;
	if(pca.direction == "Columns") table = exports.transposeTable(table,{transpose:true});
	
	var result = {
		header:[],
		body:[],
		metadata:table.metadata
	}

	table = exports.ReduceNull(table,{
		reduce:{
			enable:true,
			direction:"Rows", 
			mode:"Has Null"
		}	
	});

	

	if(table.body.length < table.header.length) return result;

	var data = PCA(table);

	if (pca.result == "Scores"){
		var values = data.scores;
		result.header = values[0].map(function(item,index){
			return {
				metadata:[{
					dimension:"pc",
					dimensionLabel:"Principal Component",
					id:"index",
					label:("PC"+(index+1))
				}]
			}
		})
		table.body.forEach(function(row,index){
			result.body.push({
				metadata : row.metadata.map(function(item){return item})
				.concat({
					dimension:"type",
					dimensionLabel:"Type",
					id:"o",
					label:"Object"
				}),
				value : values[index].map(function(item){return item})
			})
		})

		// table.header.forEach(function(col,index){
		// 	result.body.push({
		// 		metadata : col.metadata.map(function(item){return item})
		// 		.concat({
		// 			dimension:"type",
		// 			dimensionLabel:"Type",
		// 			id:"o",
		// 			label:"Eigen Vector"
		// 		}),
		// 		value : data.eigenVectors[index].map(function(item){return item})
		// 	})
		// })

		// result.body.push({
		// 		metadata : table.header[0].metadata.map(function(item){return item})
		// 		.concat({
		// 			dimension:"type",
		// 			dimensionLabel:"Type",
		// 			id:"o",
		// 			label:"Origin"
		// 		}),
		// 		value : data.eigenVectors[0].map(function(item){return 0})
		// 	})

		if(pca.direction == "Columns") result = exports.transposeTable(result,{transpose:true});
		return result;
	}

	if(pca.result == "Eigen Values"){
		var values = data.eigenValues;

		result.header = values[0].map(function(item,index){
			return {
				metadata:[{
					dimension:"ev",
					dimensionLabel:"Value",
					id:"index",
					label:("EV"+(index+1))
				}]
			}
		})

		result.body.push({
			metadata:[{
				dimension:"evs",
				dimensionLabel:"Eigen Values",
				id:"evs",
				label:"Eigen Values"	
			}],
			value : values.map(function(row,index){
				return row[index]
			})
		})
		return result;
	}

	// if(pca.result == "Eigen Vectors"){
	// 	var values = data.eigenVectors;

	// }


	// return data;

}

exports.clusters = function(table,params){
	if(!params.cluster) return table;
	if(!params.cluster.enable) return table;
	
	var cluster= params.cluster;

	if(cluster.direction == "Columns") table = exports.transposeTable(table,{transpose:true});

	var clusterList = CLUSTER.kmeans(
							cluster.count, 
							table.body.map(function (row) { return row.value})
						);

	 table = exports.transposeTable(table,{transpose:true});
	 table.body.push(
	 	{
	 		metadata:table.body[0].metadata.map(function(item){
	 			return {
	 				dimension : item.dimension,
	 				dimensionLabel : item.dimensionLabel,
	 				id: item.id,
	 				label: item.label
	 			}	
	 		}),
	 		value: clusterList.assignments.map(function(item){return item+1})
	 	}
	 )
	 table.body[table.body.length-1].metadata.forEach(function(item,index){
	 		if(index<table.body[table.body.length-1].metadata.length-1){
	 			item.id = "";
	 			item.label = "";
	 		}else{
	 			item.id = "cls";
	 			item.label = "Cluster Index";
	 		}
	 })		
	 table = exports.transposeTable(table,{transpose:true});
	

	if(cluster.direction == "Columns") table = exports.transposeTable(table,{transpose:true});
	return table;

}


var executeStep = function (table,params){
	var useColumnMetadata = params.useColumnMetadata || [];
	var useRowMetadata = params.useRowMetadata || [];
	var normalize = params.normalization;
	var reduce = params.reduce;
	var precision = params.precision || -1;
	var transpose = params.transpose;
	var order = (params.order) ? params.order : {enable:false}; 
	// var numbers = (params.numbers) ? params.numbers : {enable:false}; 
	var aggregation = (params.aggregation) ? params.aggregation : {enable:false};
	var rank = (params.rank) ? params.rank : {enable:false};
	var histogram = (params.histogram) ? params.histogram : {enable:false};
	var correlation = (params.correlation) ? params.correlation : {enable:false};
	var limit = (params.limit) ? params.limit : {enable:false};
	var cluster = (params.cluster) ? params.cluster : {enable:false};

	var pca = (params.pca) ? params.pca : {enable:false};
    var inputation = (params.inputation) ? params.inputation : {enable:false};

	table = exports.convertMetadata(table,params);

	
	if (reduce) table = exports.ReduceNull(table,params);
	if (normalize) table = exports.Normalize(table,params);
	if (pca) table = exports.pca(table,params);
	if (cluster) table = exports.clusters(table,params);

	// if (category) table = exports.categorize(table,params);

	if (histogram) table = exports.histogram(table,params);
	if (correlation) table = exports.correlationMatrix(table,params);

	if(order.enable) table = exports.orderTable(table,params);
	
	if(rank.enable) table = exports.addRanks(table,params);

	if(aggregation.enable) table = exports.addAggregations(table,params);
	if(transpose) table = exports.transposeTable(table,params) 
	if(limit) table = exports.limit(table,params) 
	if(inputation) table = exports.inputation(table,params)	

	

	if (precision >=0 ){
		table.body.forEach(function(currentRow){
			currentRow.value = currentRow.value.map(function(v){
				return 	(v == null)? 	null : 
				 						new Number(v.toFixed(precision))
			})	
		})
	}


	
	// table.processed = "PostProcess"
	// table.postProcess = (params) ? params : "undef";

	return table; 		
}


exports.joinTables = function(tables,params){

	if(!params.join) return tables;
	if(!params.join.enable) return tables;
	
	var result = {metadata:{}};
	var direction = params.join.direction || "Rows";
	var joinMode = params.join.mode || "left join"; // "inner"
	var metaTest = params.join.test || []; // [t1.metadataindex. t2metadataindex]
	var table1 = tables[0];
	table1.header.forEach(function (col){
		var cc = col.metadata.map(function(m){return m.label}).join(",")
		col.metadata = [{
			id: cc, 
			label: cc, 
			dimension: "Concatenated Meta", 
			dimensionLabel: "Concatenated Meta"
		}]
		
	})

	
	var table2 = tables[1];
	table2.header.forEach(function (col){
		var cc = col.metadata.map(function(m){return m.label}).join(",")
		col.metadata = [{
			id: cc, 
			label: cc, 
			dimension: "Concatenated Meta", 
			dimensionLabel: "Concatenated Meta"
		}]
		
	})
	
	// var result = {};
	result.header = table1.header
						.map(function(item){
							return item
						})
						.concat(
							table2.header
								.map(function(item){
									return item
								})
						);

	var equalsMetas = function (m1,m2,test){

		var f = test.length>0;
		test.forEach(function(t){
			f &= (m1[t[0]].dimension == m2[t[1]].dimension) && (m1[t[0]].id == m2[t[1]].id)
		})
		return f;
	}

	var nulls = function(count){
		var _r = [];
		while(count-- > 0) _r.push(null)
		return _r;	
	}

	if(joinMode == "left join"){
		result.body = new Query()
			.from(table1.body)
			.wrap("a")
			.leftJoin(
				new Query()
					.from(table2.body)
					.wrap("b")
					.get(),
				function(r1,r2){
					return equalsMetas(r1.a.metadata,r2.b.metadata,metaTest)
				}	
			)
			.map(function(row){
				return {
					metadata:row.a.metadata,
					value: row.a.value.concat((row.b) ? row.b.value : nulls(table2.header.length))
				}
			})
			.distinct()
			.get()
	} else {
		result.body = new Query()
			.from(table1.body)
			.wrap("a")
			.innerJoin(
				new Query()
					.from(table2.body)
					.wrap("b")
					.get(),
				function(r1,r2){
					return equalsMetas(r1.a.metadata,r2.b.metadata,metaTest)
				}	
			)
			.map(function(row){
				return {
					metadata:row.a.metadata,
					value: row.a.value.concat((row.b) ? row.b.value : nulls(table2.header.length))
				}
			})
			.distinct()
			.get()
	}		
	// result.metadata = {}
	return result;	 	
}

exports.PostProcess = function(table,params){
	if(params.join && params.join.enable){
		var currentTable = exports.joinTables(table,params)
		currentTable.postProcess = params;
		return currentTable;
	}	
	 var script = (params.script) ? params.script : [params];
	 var currentTable = table;
	 script.forEach(function(operation){
	 	currentTable = executeStep(currentTable, operation)
	 })

	 currentTable.postProcess = script;

	 return currentTable;
}


exports.convertMetadata = function(table,params){
  var useColumnMetadata = params.useColumnMetadata || [];
  var useRowMetadata = params.useRowMetadata || [];

  var concatMeta = function(list,usage){
	var meta_result = {
		id: "", 
		label: "", 
		dimension: "", 
		dimensionLabel: ""
	};
	
	var data;
	if( usage == null || usage == undefined || (usage.length && usage.length == 0)){
		data = list
	}else{
		data = list
				.filter(function(item,index){
					return usage[index];
				});
	}
	
	data.forEach(function(item,index){

		meta_result.id += item.id;
		meta_result.id += (index < data.length-1) ? ", " : "";

		meta_result.label += item.label;
		meta_result.label += (index < data.length-1) ? ", " : "";

		meta_result.dimension += "Concatenated Meta" 
		
		meta_result.dimensionLabel += item.dimensionLabel;
		meta_result.dimensionLabel += (index < data.length-1) ? ", " : "";

	})
	return meta_result;
  }

  var allFalse = function(list){
  	return list.filter(function(item){return item == false}).length == list.length;
  }


  	if(useRowMetadata.length >0 && !allFalse(useRowMetadata)){
      table.body.forEach(function(row){
      	row.metadata = [concatMeta(row.metadata,useRowMetadata)];
	  });
	}  

	if(useColumnMetadata.length >0 && !allFalse(useColumnMetadata)){
      table.header.forEach(function(col){
      	 	col.metadata = [concatMeta(col.metadata,useColumnMetadata)]
      });
    }  

      
      return table;
	
}


exports.BarChartSerie = function(table,params){
	  
	  // var useColumnMetadata = params.useColumnMetadata || [];
	  // var useRowMetadata = params.useRowMetadata || [];
	  // var normalize = params.normalized || false;
	  // var precision = params.precision || null; 		
	  // if (normalize) table = exports.Normalize(table,params)
	  
	  var result = [];
      table.body.forEach(function(serieData){
      	var currentSerie = {key:serieData.metadata[0].label,values:[]}
      	table.header.forEach(function(currentColumn,index){
      		currentSerie.values.push(
      				{
      					label : currentColumn.metadata[0].label,
      					value : serieData.value[index]
      				}
      			)
      	})
      	result.push(currentSerie)
      })

      return result;
}

// Execute K-means & Generate Scatter Series
// Parameters:
// clustered			true/false 	passed to PCAResults							(default false)
// clusters				integer > 0 Number of clusters passed to Clusterer			(default 2)
// includeCentroids		true/false 	passed to Clusterer								(default false)
// withRadius			true/false 	passed to Clusterer								(default false)
// precision 			see exports.FormatValues params 	(default null)


exports.ClusterResults = function(serie,params){

	var clusters = params.clusters || 2;
	var includeCentroids = params.includeCentroids || false;
	var withRadius = params.withRadius || false;
	var precision = params.precision || null;

	var clsInputData = serie.values.map(function (item) {
        return [item.x, item.y];
	});

	var clusterList = CLUSTER.kmeans(clusters, clsInputData);

	 if (precision != null){
     		var newData = [];
     		clusterList.centroids.forEach(function(row){
     			newData.push(row.map(function(item){
     				return new Number(item.toFixed(precision))
     			}))
     		});
     		clusterList.centroids = newData;
    } 		

	serie.radiusVector = withRadius;
	serie.values.forEach(function (item, index) {
		item.cluster = clusterList.assignments[index];
		item.ox = clusterList.centroids[clusterList.assignments[index]][0];
		item.oy = clusterList.centroids[clusterList.assignments[index]][1];
  	});
 
	var result = [];

	for (var i = 0; i < clusters; i++) {
		result.push({
		  key: serie.key + " " + "Cls " + i,
		  radiusVector: withRadius,
		  values: serie.values.filter(function (item) {
		    return item.cluster == i;
		  }),
		  base: { title: "Loadings PC1" }
		});
	}

	if ( includeCentroids ){
		result.push({
			key: "Centroids ",
			values: clusterList.centroids.map(function (item, index) {
			  return {
			    label: "Centroid " + index,
			    x: item[0],
			    y: item[1]
			  };
			}),
			base: { title: "Loadings PC1" }
		});
	}

  return result;
}

// Execute PCA & Generate Scatter Series
// Parameters:
// axisX   				index of X axis values 										(default 0) 
// 						if axisX < 0 then use row metadata[abs(params.axisX)-1].id as X axis values
// pca 					true/false 													(default false)
// includeLoadings		true/false 													(default false)
// clustered			true/false 	passed to PCAResults							(default false)
// clusters				integer > 0 Number of clusters passed to Clusterer			(default 2)
// includeCentroids		true/false 	passed to Clusterer								(default false)
// withRadius			true/false 	passed to Clusterer								(default false)
// precision 			see exports.FormatValues params 	(default null)

exports.PCAResults = function (table,params){
	
	var useColumnMetadata = params.useColumnMetadata || [];
	var useRowMetadata = params.useRowMetadata || [];
	  
	
	var axisXIndex = params.axisX || 0; 
	var precision = params.precision || null;
	var includeLoadings = params.includeLoadings || false;
	var withRadius = params.withRadius || false;
	var clustered = params.clustered || false;

	table = exports.ReduceNull(table,{direction:"Rows", mode:"Has Null"});

	var data = PCA(table);
	
	 if (precision != null){
     		var newData = { eigenValues:[], scores:[], eigenVectors:[] }
     		data.scores.forEach(function(row){
     			newData.scores.push(row.map(function(item){
     				return new Number(item.toFixed(precision))
     			}))
     		});
     		data.eigenValues.forEach(function(row){
     			newData.eigenValues.push(row.map(function(item){
     				return new Number(item.toFixed(precision))
     			}))
     		});
     		data.eigenVectors.forEach(function(row){
     			newData.eigenVectors.push(row.map(function(item){
     				return new Number(item.toFixed(precision))
     			}))
     		});	
     		data = newData;	

     }

    var result = []; 

  	var serie = { key: "Principle Component 2", values: [], base: { title: "Principle Component 1" } };
	
	table.body.forEach(function(currentRow,index){
		serie.values.push({
	      label: concatLabels(currentRow.metadata,useRowMetadata),
	      x: data.scores[index][0],
	      y: data.scores[index][1]
	    });
	})

	result.push(serie);

	if ( includeLoadings ){
		var loadings = {
		    key: "Loadings PC2",
		    radiusVector: withRadius,
		    values: [{ label: "0,0", x: 0, y: 0 }, { label: "", x: -1, y: -1 }, { label: "", x: 1, y: 1 }],
		    base: { title: "Loadings PC1" }
		};

		table.header.forEach(function(currentVar,index){
			loadings.values.push({
		      label: concatLabels(currentVar.metadata,useColumnMetadata),
		      ox: 0,
		      oy: 0,
		      x: data.eigenVectors[index][0],
		      y: data.eigenVectors[index][1]
		    });
		})

		result.push(loadings);
	}

	if ( clustered ){
		var series = exports.ClusterResults(serie,params);
		if (includeLoadings) series.push(loadings);
		return series;
	}
	
	return result;
}


exports.categorize = function(table,params){
	if(!params.category) return table;
	if(!params.category.enable) return table;
	
	var category= params.category;

	if(category.direction == "Columns") table = exports.transposeTable(table,{transpose:true});
	 
	var categories; 

	table = exports.transposeTable(table,{transpose:true});

	if( category.index >= 0 ){
	 	categories = table.body[category.index].value.map(function(item){
	 		return item
	 	})
	 } else {
	 	categories = table.header.map(function(row){
	 		return row.metadata[-category.index-1].label
	 	});
	} 



	table = exports.transposeTable(table,{transpose:true});
	

	var categories = categories
		.sort(function(a,b){
		if(!isNaN(new Number(a)) && !isNaN(new Number(b))){
			return a-b
		}else{
			return b<a
		}
	})
	var catList = [];
	categories.forEach(function(cat){
		if (catList.indexOf(cat) < 0) catList.push(cat)
	})	


	var b = [];
	catList.forEach(function(cat){
		b.push({
			"category" : cat,
			"rows" : table.body.filter(function(row){
				return row.value[category.index] == cat
			})
		}) 
	})

	return b;
}



exports.scatter_serie = function(table,params){


	var axisXIndex = params.axisX || 0;
	var xValues = [];
	var categories = [];
	var base;
	var result = [];

	if ( !params.index ) return {};
	if ( params.index.length == 0 ) return {};


	table = exports.ReduceNull(table,{
		reduce:{
			enable:true,
			direction:"Rows",
			mode:"Has Null"
		}
	})

	table = exports.transposeTable(table,{transpose:true});

	
	if( params.category >= 0 ){
	 	categories = table.body[params.category].value.map(function(item){
	 		return item
	 	})
	 }

	if( params.category < 0 ){
	 	categories = table.header.map(function(row){
	 		return row.metadata[-params.category-1].label
	 	});
	}

	var cats = categories
	// 	.sort(function(a,b){
	// 	if(!isNaN(new Number(a)) && !isNaN(new Number(b))){
	// 		return a-b
	// 	}else{
	// 		return b<a
	// 	}
	// })

	var catList = [];
	cats.forEach(function(cat){
		if (catList.indexOf(cat) < 0) catList.push(cat)
	})	

	

	if( axisXIndex>=0 ){
	 	xValues = table.body[axisXIndex].value.map(function(item){
	 		return item
	 	});
	 	base = table.body[axisXIndex].metadata.map(function(item){ return item.label}).join(", ")
	} else {
	 	xValues = table.header.map(function(row){
	 		return row.metadata[-axisXIndex-1].label
	 	});
	 	base = table.header[0].metadata[-axisXIndex-1].dimensionLabel
	}

	xValues = xValues.map(function(item){return new Number(item)})

	var isNumbers = true;
 	isNumbers= xValues.reduce(function(isNumbers,item){ 
 		return isNumbers && (!isNaN(item))
 	})

 	if(!isNumbers){
 		base += "(Row Index)";
 		xValues = xValues.map(function(item,index){
 			return index
 		})
 	}

 	if(catList.length == 0){
 		catList = [0];
 		categories = [];
 		table.body[0].value.forEach(function(item){
 			categories.push(0)
 		})
 	}
 	
 	 table.body.forEach(function(row,index){
 	 	if(params.index.indexOf(index) >= 0){
	 	 	
 	 		catList.forEach(function(cat, catIndex){
 	 			result.push({
 	 				"category" : cat,
		 	 		"key" : ((params.category) ? ("Category: "+cat+", ") : "")
		 	 			+row.metadata.map(function(item){ return item.label}).join(", "),
					"base" : base,
					"values": row.value.map(function(item,j){
						return {
							"category" : categories[j],
							"x" : xValues[j],
							"y" : item,
							"label" : 
								row.metadata.map(function(item){ return item.label}).concat(
								table.header[j].metadata.map(function(item){ return item.label})).join(", ") 
						}
					})
	 	 		})	
 	 		})
	 	} 	
 	 })

 	 result.forEach(function(serie){
 	 	serie.values = serie.values.filter(function(item){return item.category == serie.category})
 	 })


	// if( axisXIndex>=0 ){
	//  	xValues = table.body.map(function(row){
	//  		return row.value[axisXIndex]
	//  	});
	//  	base = table.header[axisXIndex].metadata.map(function(item){ return item.label}).join(", ")
	// } else {
	//  	xValues = table.body.map(function(row){
	//  		return row.metadata[-axisXIndex-1].label
	//  	});
	//  	base = table.body[0].metadata[-axisXIndex-1].label
	// }
 	
 // 	var isNumbers = true;
 // 	isNumbers= xValues.reduce(function(isNumbers,item){ 
 // 		return isNumbers && UTIL.isNumber(item)
 // 	})
 // 	if(!isNumbers){
 // 		xValues = xValues.map(function(item,index){return index})
 // 	}

 // 	var result = [];

 // 	table.header.forEach(function(col,index){
 // 		if(index != axisXIndex){
 // 			var values = [];
 // 			table.body.forEach(function(row,j){
 // 				if(!UTIL.isUndefined(row.value[j]) && !UTIL.isNull(row.value[j]) && !isNaN(row.value[j]))
 // 				values.push(
 // 					{
 // 						"label": row.metadata.map(function(item){ return item.label}).join(", "),
 // 						"x": xValues[j],
 // 						"y": row.value[index],
 // 						"j":j,
 // 						"index":index
 // 					} 
 // 				)
 // 			}) 
 // 			result.push(
 // 			{
 // 				"key" : col.metadata.map(function(item){ return item.label}).join(", "),
 // 				"base" : base,
 // 				"values": values
 // 			})
 // 		}
 // 	})
	
	return result; 
}	

// Generate Scatter Series
// Parameters:
// axisX   				index of X axis values 										(default 0) 
// 						if axisX < 0 then use row metadata[abs(params.axisX)-1].id as X axis values
// normalized 			true/false 													(default false)
// mode 				see exports.Normalize mode
// pca 					true/false 													(default false)
// includeLoadings		true/false 	passed to PCAResults							(default false)
// clustered			true/false 	passed to PCAResults							(default false)
// clusters				integer > 0 Number of clusters passed to PCAResults			(default 2)
// includeCentroids		true/false 	passed to PCAResults							(default false)
// withRadius			true/false 	passed to PCAResults							(default false)
// precision 			see exports.FormatValues params 	(default null)

exports.ScatterSerie = function (table,params){
	return exports.scatter_serie(table,params)
	 
	 var axisXIndex = params.axisX || 0;
 	 var normalize = params.normalized || false;
	 var pca = params.pca || false;
	 var precision = params.precision || null;
	 var useColumnMetadata = params.useColumnMetadata || [true];
	 var useRowMetadata = params.useRowMetadata || [true];
	  

	 // table = exports.ReduceNull(table,{direction:"Rows",mode:"Has Null"});

	 
	 if (pca) return exports.PCAResults(table, params);

	 if (normalize) table = exports.Normalize(table,{direction:"Columns", mode:params.mode})
     
     if (precision != null){
     		table = exports.FormatValues(table,{precision:precision})
     }      

  var xValues = [];
  var labels = [];
  var yValues = [];
  var series = table.header.filter(function(item,index){return index != axisXIndex});
 

  var baseLabel;
  if(axisXIndex < 0){
  	baseLabel = table.body[0].metadata[-axisXIndex-1].dimension;
  	table.body.forEach(function(currentRow,rowIndex){
      	xValues.push(
      		(!isNaN(currentRow.metadata[-axisXIndex-1]).id) ? 
      			new Number(currentRow.metadata[-axisXIndex-1].id) 
  				: rowIndex);
      	labels.push(concatLabels(currentRow.metadata,useRowMetadata));
      	yValues.push(currentRow.value)
      })
  }else{
      table.body.forEach(function(currentRow){
      	xValues.push( currentRow.value[axisXIndex] );
      	labels.push( concatLabels(currentRow.metadata,useRowMetadata) );
      	var tmp = 
      	yValues.push( currentRow.value.filter( function(item,index){ return index != axisXIndex}) )
      })
	  }

  var result = [];
  series.forEach(function(serie, yValueIndex){
  		var currentSerie = {
  			key		: concatLabels(serie.metadata,useColumnMetadata), 
  			base 	: (axisXIndex < 0)? baseLabel : concatLabels(table.header[axisXIndex].metadata,useColumnMetadata),
  			values 	: []
  		}
  		xValues.forEach(function(currentXValue, index){
  			currentSerie.values.push({
      				label 	: labels[index],
      				x 		: xValues[index],
      				y 		: yValues[index][yValueIndex]
      		})
  		})
  		currentSerie.values = currentSerie.values.filter(function(item){
  			return ( item.x != null ) && ( item.y != null )
  		});
  		currentSerie.values.sort(function(a,b){return a-b})
  		result.push(currentSerie);
  })
  return result
}



var getGeoCode = require("./geo-coding").getCode;
var copyObject = require('copy-object');

exports.GeoChartSerie = function(table,params){

	if(!params) return {};
	
	params.direction = (params.direction) ? params.direction : "Rows";
	params.colorDataIndex = (UTIL.isUndefined(params.colorDataIndex)) ? 0 : params.colorDataIndex;
	
	if(params.direction == "Columns") table = exports.transposeTable(table,{transpose:true});

	if(table.body.length == 0) return {};
		
	var rowIndex = -1;
	table.body[0].metadata.forEach(
			function(item,index){
				if (item.role == "geo") {rowIndex = index}
			})

	if(rowIndex<0) return {};

	//create data table for geoChart
	var result = []; 

	if(UTIL.isUndefined(params.radiusDataIndex)){
		result.push([
			"code",
			"text",
			table.header[params.colorDataIndex].metadata.map(function(item){return item.label}).join(", ")
		]);
		table.body.forEach(function(row){
			result.push([
				getGeoCode(row.metadata[rowIndex].id),
				row.metadata.map(function(item){return item.label}).join(", "),
				row.value[params.colorDataIndex]
			])
		})
	}else{
		result.push([
			"code",
			"text",
			table.header[params.colorDataIndex].metadata.map(function(item){return item.label}).join(", "),
			table.header[params.radiusDataIndex].metadata.map(function(item){return item.label}).join(", "),
		])
		table.body.forEach(function(row){
			result.push([
				getGeoCode(row.metadata[rowIndex].id),
				row.metadata.map(function(item){return item.label}).join(", "),
				row.value[params.colorDataIndex],
				row.value[params.radiusDataIndex]
			])
		})
	}




	return result;
};


var intersect = require("./lib/arrays").intersect;
var fs = require("fs");

exports.geojson = function(table,params){

	if(!params) return {};
	
	params.direction = (params.direction) ? params.direction : "Rows";
	params.dataIndex = (UTIL.isUndefined(params.dataIndex)) ? [0] : params.dataIndex;
	params.bins = (params.bins)? params.bins : 1;
	params.scope = (params.scope) ? (params.scope) : "none"; 
	if(params.direction == "Rows") table = exports.transposeTable(table,{transpose:true});

	if(table.body.length == 0) return {};
		
	var geoIndex = -1;
	table.header[0].metadata.forEach(
			function(item,index){
				if (item.role == "geo") {geoIndex = index}
			})

	if(geoIndex<0) return {};

	//create data table for geoChart
	var geodata = require("../../wdc_libs/wdc-geojson.js").geodata;

	var dataIndex = params.dataIndex.sort(function(a,b){return a-b});
	
	dataIndex = dataIndex.map(function(item){
			return {
				index : item,
				label : table.body[item].metadata.map(function(item){return item.label}).join(", "),
				values : table.body[item].value,
				max : STAT.max(table.body[item].value),
				min : STAT.min(table.body[item].value),
				categories : 	params.bins,
				ordinal : STAT.Ordinal(
					STAT.min(table.body[item].value),
					STAT.max(table.body[item].value),
					params.bins
				)
			}
		});

	var series = dataIndex.map(function(item){
		return {
			key: item.label,
			min : item.min,
			max: item.max,
			cats : item.categories 
		}
	}) 

	var attrs = [];
	for(var i=0; i<table.body[0].value.length; i++){
		attrs.push({
			geocode: table.header[i].metadata[geoIndex].id,
			values: (function(index){
				var temp = [];
				dataIndex.forEach(function(di){
					temp.push({
						// l : di.label,
						v : di.values[index],
						c : di.ordinal(di.values[index])
					})
				})
				return temp;
			})(i)
		})
	}


	var geocodes = attrs.map(function (item){return item.geocode});
	// return geodata[0].properties;

	var geojs = geodata
		.filter(function(item){
			if(!item.properties) return false
			if(!item.properties.geocode) return false
				
			return intersect(item.properties.geocode, geocodes).length > 0
		})
	



	var res = [];
	attrs.forEach(function(a){
		var g = geojs.filter(function(item){ return item.properties.geocode.indexOf(a.geocode)>=0})[0];
		if(g){
			g.properties.values = a.values;
			res.push(g);
		}
	})

	var geoScope = (params.scope == "none") ? [] :
		geodata
			.filter(function(item){
				if(!item.properties) return false
				if(!item.properties.geocode) return false	
				return (intersect(item.properties.geocode, geocodes).length == 0) &&
					    (item.properties.scope.indexOf(params.scope)>=0)
			})	


	
	if(res.length == 0) {
			res = {}
	} else{
		res = res.concat(geoScope);

	}

	res.forEach(function(item){
		item.properties.geocode = item.properties.geocode[0];
		item.properties.scope = undefined; 
	})			

	// var path= "/data/"+Math.random().toString(36).substring(2)+".json"
	// var filename = "./.tmp/public"+path;

	
	// fs.writeFileSync(filename, JSON.stringify({"series":series, features:res}));
	// return path;
	return [{"series":series, features:res}] 
	 
}

// Generate Statistical Distributions as Scatter Series
// Parameters:
// normalized 			true/false 													(default false)
// mode 				see exports.Normalize mode
// direction 			Columns/Rows 												(default Columns)
// beans				number of Distribution beans							    (default 5)
// precision 			see exports.FormatValues params 							(default null)
// cumulate                                                                         (default false)
exports.Distribution = function(table,params){

	var beans = params.beans || 5;
	var normalize = params.normalized || false;
	var direction = params.direction || "Columns";
	var precision = params.precision || 2;
	var cumulate = params.cumulate || false;
	var useColumnMetadata = params.useColumnMetadata || [];
	var useRowMetadata = params.useRowMetadata || [];


	// normalize data if needed
	if ( normalize ) {
		if( direction == "Columns" )
			table = exports.Normalize(table,{direction:"Columns", mode:params.mode});
		if( direction == "Rows" )
			table = exports.Normalize(table,{direction:"Rows", mode:params.mode})
	}

	// find global max, min

	var gMax,gMin;

	table.body.forEach(function(currentRow){
		currentRow.value.forEach(function(item){
			if (item !=null){
				gMax = (gMax != undefined) ? Math.max(gMax,item) : item;
				gMin = (gMin != undefined) ? Math.min(gMin,item) : item;
			}
		})
	})
	

	var result = []

	var initHistogram = function(serie,beans){
			var step = (gMax - gMin) / beans;
			for (var j = 0; j < beans; j++) {
			  serie.values.push({
			    label: (gMin+(j) * step).toFixed(3)+" - "+ (gMin+(j+1) * step).toFixed(3),
			    x: new Number((gMin+(j + 0.5) * step).toFixed(3)),
			    y: 0
			  });
			}
			serie.values[0].x = gMin;
			serie.values[beans-1].x = gMax;
			
			return serie;	 
	}

	var generateHistogram = function(values, serie, beans){
		
		values.forEach(function(item){
				if(item !=null){
					var index = Math.floor((item - gMin) / (gMax - gMin) * beans);
					index = index == beans ? index - 1 : index;
					serie.values[index].y += 1;
				}
			})
			if (cumulate){
				var s = 0;
				serie.values.forEach(function (val) {
					val.y = s += val.y;
				});
			}

			var l = values.filter(function(item){return item != null}).length;
			serie.values = serie.values.map(function (item) {
				return { 
					label: /*(precision != null) ? item.label.toFixed(precision) :*/ "Bean: "+item.label, 
					x: new Number((item.x*1).toFixed(3)), 
					// y: (precision != null) ? new Number((item.y/l).toFixed(precision)) : item.y/l};
					y: new Number((item.y/l).toFixed(3))
				}	
			});
		return serie;	
	}
		
	if (direction == "Rows"){
		table.body.forEach(function(currentRow){
			var hist = {key:concatLabels(currentRow.metadata,useRowMetadata), values:[]};
			hist = initHistogram( hist, beans);
			// for (var j = 0; j < beans; j++) {
			//   serie.values.push({
			//     label: ((j + 0.5) * (gMax - gMin) / beans),
			//     x: ((j + 0.5) * (gMax - gMin) / beans),
			//     y: 0
			//   });
			// }
			// currentRow.value.forEach(function(item){
			// 	if(item !=null){
			// 		var index = Math.floor((item - gMin) / (gMax - gMin) * beans);
			// 		index = index == beans ? index - 1 : index;
			// 		serie.values[index].y += 1;
			// 	}
			// })
			// if (cumulate){
			// 	var s = 0;
			// 	serie.values.forEach(function (val) {
			// 		val.y = s += val.y;
			// 	});
			// }

			// var l = currentRow.value.filter(function(item){return item != null}).length;
			// serie.values = serie.values.map(function (item) {
			// 	return { 
			// 		label: (precision != null) ? item.label.toFixed(precision) : item.label, 
			// 		x: (precision != null) ? new Number(item.x.toFixed(precision)) : item.x, 
			// 		y: (precision != null) ? new Number((item.y/l).toFixed(precision)) : item.y/l};
			// });

			result.push(generateHistogram(currentRow.value, hist, beans));
		})
		return result;
	}

	if( direction == "Columns"){

		table.header.forEach(function(currentColumn,columnIndex){
			var hist = {key:concatLabels(currentColumn.metadata,useColumnMetadata), values:[]};
			hist = initHistogram(hist, beans);
			// for (var j = 0; j < beans; j++) {
			//   serie.values.push({
			//     label: ((j + 0.5) * (gMax - gMin) / beans),
			//     x: ((j + 0.5) * (gMax - gMin) / beans),
			//     y: 0
			//   });
			// }
			

			var columnData = table.body.map(function(item){
				return item.value[columnIndex]
			});


			// table.body.forEach(function(currentRow){
			// 	var item = currentRow.value[columnIndex];
			// 	if(item !=null){
			// 		var index = Math.floor((item - gMin) / (gMax - gMin) * beans);
			// 		index = index == beans ? index - 1 : index;
			// 		serie.values[index].y += 1;
			// 	}	
			// })
			// if (cumulate){
			// 	var s = 0;
			// 	serie.values.forEach(function (val) {
			// 		val.y = s += val.y;
			// 	});
			// }

			// var l = 0;
			// table.body.forEach(function(currentRow){
			// 	if(currentRow.value[columnIndex] != null) l++;
			// })
			
			// serie.values = serie.values.map(function (item) {
			// 	return { 
			// 		label: (precision != null) ? item.label.toFixed(precision) : item.label, 
			// 		x: (precision != null) ? new Number(item.x.toFixed(precision)) : item.x, 
			// 		y: (precision != null) ? new Number((item.y/l).toFixed(precision)) : item.y/l};
			// });
			result.push(generateHistogram(columnData, hist, beans))
		})
		return result;
	}

	return {response : "No Execution"}		
}




// {
// 	"cache":false,
//     "data_id":"56daffd0d7620c1056ef460a",
//     "params":{
//     	"script":[
// 	    	{
// 	    		"useColumnMetadata":[],
// 	        	"useRowMetadata":[],
// 	        	"normalization":{"enable":false,"mode":"Range to [0,1]","direction":"Columns"},
// 	        	"reduce":{"enable":false,"mode":"Has Null","direction":"Columns"},
// 	        	"transpose":false,
// 	        	"order":{"enable":false,"direction":"Rows","asc":"A-Z","index":0},
// 	        	"cluster":{"enable":false,"direction":"Rows","count":2},
// 	        	"aggregation":{"enable":false,"direction":"Columns","data":["min","max"]},
// 	        	"rank":{"enable":false,"direction":"Rows","asc":"A-Z","indexes":[]},
// 	        	"limit":{"enable":false,"start":1,"length":10},
// 	        	"histogram":{"enable":false,"direction":"Rows","cumulate":false,"beans":5},
// 	        	"correlation":{"enable":false,"direction":"Rows"},
// 	        	"pca":{"enable":false,"direction":"Rows","result":"Scores"}
// 	     	},
// 	     	{
// 	    		"useColumnMetadata":[],
// 	        	"useRowMetadata":[],
// 	        	"normalization":{"enable":false,"mode":"Range to [0,1]","direction":"Columns"},
// 	        	"reduce":{"enable":false,"mode":"Has Null","direction":"Columns"},
// 	        	"transpose":false,
// 	        	"order":{"enable":false,"direction":"Rows","asc":"A-Z","index":0},
// 	        	"cluster":{"enable":false,"direction":"Rows","count":2},
// 	        	"aggregation":{"enable":true,"direction":"Columns","data":["min","max"]},
// 	        	"rank":{"enable":false,"direction":"Rows","asc":"A-Z","indexes":[]},
// 	        	"limit":{"enable":false,"start":1,"length":10},
// 	        	"histogram":{"enable":false,"direction":"Rows","cumulate":false,"beans":5},
// 	        	"correlation":{"enable":false,"direction":"Rows"},
// 	        	"pca":{"enable":false,"direction":"Rows","result":"Scores"},
// 	            "precision":2
// 	     	}
//         ]
//      },
//      "proc_name":"post-process",
//      "response_type":"data"
// }
