// clusterize rows(colunms)
// 

var transposeTable			= require("../table/transpose"),
	CLUSTER 				= require("../lib/cluster").CLUSTER;
	

module.exports = function(table,params){
	// if(!params.cluster) return table;
	// if(!params.cluster.enable) return table;
	
	var cluster= (params.cluster) ? params.cluster : params;

	if(cluster.direction == "Columns") table = transposeTable(table,{transpose:true});

	var clusterList = CLUSTER.kmeans(
							cluster.count, 
							table.body.map(function (row) { return row.value})
						);

	 table = transposeTable(table,{transpose:true});
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
	 table = transposeTable(table,{transpose:true});
	

	if(cluster.direction == "Columns") table = transposeTable(table,{transpose:true});
	return table;

}