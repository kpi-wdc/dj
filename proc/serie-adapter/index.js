var Query = require("./lib/query").Query,
	STAT = require("./lib/stat"),
	PCA = require("./lib/pca").PCA,
	CLUSTER = require("./lib/cluster").CLUSTER;

var concatLabels = function(list){
	var result = "";
	list.forEach(function(item,index){
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

exports.BarChartSerie = function(table){
	  
	  var result = [];
      table.body.forEach(function(serieData){
      	var currentSerie = {key:concatLabels(serieData.metadata), values:[]}
      	table.header.forEach(function(currentColumn,index){
      		currentSerie.values.push(
      				{
      					label : concatLabels(currentColumn.metadata),
      					value : serieData.value[index]
      				}
      			)
      	})
      	result.push(currentSerie)
      })

      return result;
}

exports.CorrelationMatrix = function(table){
	var series = exports.BarChartSerie(table);
	series.forEach(function(item){
		item.values = item.values.map(function (current) {
          return current.value;
        });
	});
	var result = [];
      for (var i = 0; i < series.length; i++) {
        var row = [];
        for (var j = 0; j < series.length; j++) {
          row.push({ label: series[j].key, value: STAT.corr(series[i].values, series[j].values) });
        }
        result.push({ key: series[i].key, values: row });
      }
	return result;
};

exports.CorrelationTable = function (table) {
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

  var normalizeMode = params.mode || "Range to [0,1]"; 
  var normalizeArea = params.direction || "Columns"; 

  if(normalizeArea == "Columns"){
  	table.header.forEach(function(currentColumn,columnIndex){
  		var data = table.body.map(function(currentRow){
  			return currentRow.value[columnIndex];
  		});
  		switch (normalizeMode) {
            case "Range to [0,1]":
              data = STAT.normalize(data);
              break;
            case "Standartization":
              data = STAT.standardize(data);
              break;
            case "Logistic":
              data = STAT.logNormalize(data);
              break;
          }
          data.forEach(function(currentValue,rowIndex){
          	table.body[rowIndex].value[columnIndex] = (currentValue == null) ? null : new Number (Number(currentValue).toPrecision(2)); 
          })
  	})
  	return table;
  }

  if(normalizeArea == "Rows"){
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
          	return (currentValue == null) ? null : new Number (Number(currentValue).toPrecision(2));
          })
  	})
  	return table;
  }

}

exports.ReduceNull = function(table,params){
	var direction = params.direction || "Rows"; // "Columns"
	var mode = params.mode || "Has Null"; // "All Nulls"

	
	var	hasNull = function(data){
		var result = false;
		data.forEach(function(item){
			if (item == null){
				result = true;
			}
		});
		return result;
	};
	
	var	allNulls = function(data){
		var result = 0;
		data.forEach(function(item){
			if (item == null){
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
		return table;	
	}
	
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
	      label: concatLabels(currentRow.metadata),
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
		      label: concatLabels(currentVar.metadata),
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
	 
	 var axisXIndex = params.axisX || 0;
 	 var normalize = params.normalized || false;
	 var pca = params.pca || false;
	 var precision = params.precision || null;


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
      	labels.push(concatLabels(currentRow.metadata));
      	yValues.push(currentRow.value)
      })
  }else{
      table.body.forEach(function(currentRow){
      	xValues.push( currentRow.value[axisXIndex] );
      	labels.push( concatLabels(currentRow.metadata) );
      	var tmp = 
      	yValues.push( currentRow.value.filter( function(item,index){ return index != axisXIndex}) )
      })
	  }

  var result = [];
  series.forEach(function(serie, yValueIndex){
  		var currentSerie = {
  			key		: concatLabels(serie.metadata), 
  			base 	: (axisXIndex < 0)? baseLabel : concatLabels(table.header[axisXIndex].metadata),
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

// Generate Statistical Distributions as Scatter Series
// Parameters:
// normalized 			true/false 													(default false)
// mode 				see exports.Normalize mode
// direction 			Columns/Rows 												(default Columns)
// beans				number of Distribution beans							    (default 5)
// precision 			see exports.FormatValues params 							(default null)

exports.Distribution = function(table,params){

	var beans = params.beans || 5;
	var normalize = params.normalized || false;
	var direction = params.direction || "Columns";
	var precision = params.precision || null;
	var cumulate = params.cumulate || false;


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
		
	if (direction == "Rows"){
		table.body.forEach(function(currentRow){
			var serie = {key:concatLabels(currentRow.metadata), values:[]}
			for (var j = 0; j < beans; j++) {
			  serie.values.push({
			    label: ((j + 0.5) * (gMax - gMin) / beans),
			    x: ((j + 0.5) * (gMax - gMin) / beans),
			    y: 0
			  });
			}
			currentRow.value.forEach(function(item){
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

			var l = currentRow.value.filter(function(item){return item != null}).length;
			serie.values = serie.values.map(function (item) {
				return { 
					label: (precision != null) ? item.label.toFixed(precision) : item.label, 
					x: (precision != null) ? new Number(item.x.toFixed(precision)) : item.x, 
					y: (precision != null) ? new Number((item.y/l).toFixed(precision)) : item.y/l};
			});
			result.push(serie)
		})
		return result;
	}

	if( direction == "Columns"){
		table.header.forEach(function(currentColumn,columnIndex){
			var serie = {key:concatLabels(currentColumn.metadata), values:[]};
			for (var j = 0; j < beans; j++) {
			  serie.values.push({
			    label: ((j + 0.5) * (gMax - gMin) / beans),
			    x: ((j + 0.5) * (gMax - gMin) / beans),
			    y: 0
			  });
			}
			table.body.forEach(function(currentRow){
				var item = currentRow.value[columnIndex];
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

			var l = 0;
			table.body.forEach(function(currentRow){
				if(currentRow.value[columnIndex] != null) l++;
			})
			
			serie.values = serie.values.map(function (item) {
				return { 
					label: (precision != null) ? item.label.toFixed(precision) : item.label, 
					x: (precision != null) ? new Number(item.x.toFixed(precision)) : item.x, 
					y: (precision != null) ? new Number((item.y/l).toFixed(precision)) : item.y/l};
			});
			result.push(serie)
		})
		return result;
	}		
}