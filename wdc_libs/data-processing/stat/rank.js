// Add rank into table

var   STAT            = require("../lib/stat"),
      transposeTable  = require("../table/transpose");


module.exports = function(table,params){
	if(!params.rank) return table;
	if(!params.rank.enable) return table;
	
	var rank = params.rank;
	if(rank.direction == "Columns") table = transposeTable(table,{transpose:true});
	
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

	if(rank.direction == "Columns") table = transposeTable(table,{transpose:true});
	return table;
}