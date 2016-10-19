// returns histogramm table
// 
var transposeTable = require("../table/transpose"),
	STAT = require("../lib/stat");



module.exports = function(table,params){
	if(!params.histogram) return table;
	if(!params.histogram.enable) return table;
	
	var histogram= params.histogram;

	if(histogram.direction == "Columns") table = transposeTable(table,{transpose:true});
	
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

	return histTable;
}