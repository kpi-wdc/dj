// Convert header(rows) metadata



module.exports = function(table,params){
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