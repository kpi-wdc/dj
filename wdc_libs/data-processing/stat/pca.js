// return PCA results
// 
var transposeTable			= require("../table/transpose"),
	PCA 					= require("../lib/pca").PCA,
	ReduceNull 				= require("../table/reduce-nulls");


module.exports = function(table,params){
	// if(!params.pca) return table;
	// if(!params.pca.enable) return table;
	var pca= (params.pca) ? params.pca : params;
	if(pca.direction == "Columns") table = transposeTable(table,{transpose:true});
	
	var result = {
		header:[],
		body:[],
		metadata:table.metadata
	}

	table = ReduceNull(table,{
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

		if(pca.direction == "Columns") result = transposeTable(result,{transpose:true});
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

	if(pca.result == "loadings"){
		var values = data.loadings;
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
		result.body = values.map(function(r,index){
			return {
					metadata: table.header[index].metadata,
					value: r
			}
		})
		return result;
	}	
	
}