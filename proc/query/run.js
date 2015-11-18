var query = require("./index").Query;


process.on('message', function (json) {
  delete json.hash;
  delete json.isDataSource;
  delete json.id;

  if(!json.params.select){
 	process.stderr.write("Query not exists. Params:" + JSON.stringify(json.params))
  	process.exit(1);
  }

  var params = json.params.select;
  var data = json.value;
  var dsMetadata = json.metadata;

	var getIDList = function(data,dimension,items){
		return new query(data)
					.select(function(row){
						if (items.length == 0) return true;
						var r = false;
						items.forEach(function(current){
							if(row["#"+dimension] == current){
								r = true;
								return
							} 
						});
						return r;
					})
					.map(function(row){
						return {
							id : row["#"+dimension],
							label: row[dimension]
						}
					})
					.distinct()
					.orderBy(function(a,b){
						return a.id > b.id
					})
					.execute();
	}

  var getDimensions = function(params,role){
	return new query(params)
			.select(function(item){
				return item.role == role
			})
			.execute();
}


var rowsDimension = getDimensions(params,"Rows")[0];
var columnsDimension = getDimensions(params,"Columns")[0];
var splitRowsDimensions = getDimensions(params,"Split Rows");
var splitColumnsDimensions = getDimensions(params,"Split Columns");

rowsDimension.IDList = getIDList(data,rowsDimension.dimension,rowsDimension.collection);
columnsDimension.IDList = getIDList(data,columnsDimension.dimension,columnsDimension.collection);
splitRowsDimensions.forEach(function(current){
	current.IDList = getIDList(data,current.dimension,current.collection);
})
splitColumnsDimensions.forEach(function(current){
	current.IDList = getIDList(data,current.dimension,current.collection);
})

  var result = data.filter(function(row){
	  var r = true;
	  new query(params)
	  .select(function(item){
	  	return item.role !="Disable"
	  })
	  .execute()
	  .forEach(function(dim){
	  		var r1 = false;
	  		if(dim.collection.length>0){
	  			dim.collection.forEach(function(item){ 
	  				r1 |= row['#'+dim.dimension] == item;
	  				if (r1 == true) return; 
	  			})
	  		}else{
	  			r1 = true;
	  		}
	  		r &=r1;
	  		if( r == false) return;
	  	});
	  	return r;
  });





var product = [];

rowsDimension.IDList.forEach(function(row){
	var metadata = row;
	metadata.dimension = rowsDimension.dimension;
	metadata.dimensionLabel = dsMetadata.dimension[metadata.dimension].label;
	 
	var resultRow = {metadata:[metadata], value:[]};
	var rowData = new query(result)
		.select(function(item){
			return item["#"+rowsDimension.dimension] == row.id
		})
		.execute();
	resultRow.data = rowData;
	product.push(resultRow);
})


var splitRow = function(data,dimension){
	var r = [];
	data.forEach(function(rowset){
		dimension.IDList.forEach(function(current){
			var m = current;
			m.dimension = dimension.dimension;
			m.dimensionLabel = dsMetadata.dimension[m.dimension].label; 
			
			var c = {metadata:rowset.metadata.map(function(item){return item})};
			c.metadata.push(m);
			c.data = new query(rowset.data)
						.select(function(item){return item["#"+dimension.dimension] == current.id})
						.execute();
			c.value = [];			
			r.push(c)
		});
	})
	return r;
}


var splitColumns = function(data,dimension){
	var r = [];
	data.forEach(function(colset){
		dimension.IDList.forEach(function(current){
			var m = current;
			m.dimension = dimension.dimension;
			m.dimensionLabel = dsMetadata.dimension[m.dimension].label;  
			
			var c = {metadata:colset.metadata.map(function(item){return item})};
			c.metadata.push(m);
			c.data = new query(colset.data)
						.select(function(item){return item["#"+dimension.dimension] == current.id})
						.execute();
			r.push(c)
		});
	})
	return r;
}


splitRowsDimensions.forEach(function(currentSplitter){
	product = splitRow(product,currentSplitter);
});	



product.forEach(function(row){
	var columnes = [];
	columnsDimension.IDList.forEach(function(currentColumnSet){
		var m = currentColumnSet;
		m.dimension = columnsDimension.dimension;
		m.dimensionLabel = dsMetadata.dimension[m.dimension].label;  
		columnes.push(
			{
				metadata:[m],
				data: new query(row.data)
						.select(function(item){
							return item["#"+columnsDimension.dimension] == currentColumnSet.id
						})
						.execute()
			}
			)

	})
	splitColumnsDimensions.forEach(function(currentColSplitter){
		columnes = splitColumns(columnes,currentColSplitter)
	})
	row.columnes = columnes;	
})

product.forEach(function(row){
	row.columnes.forEach(function(col){
		row.value.push((col.data.length>0)?col.data[0]["#value"]:null)
	})
})



var body = product.map(function(row){
	return {metadata:row.metadata, value:row.value}
});

var header = product[0].columnes.map(function(col){
	return {metadata:col.metadata}
})

  process.send({header:header,body:body});
  // process.send(product);
  process.exit(0);
});


// {
// "select":[
// 	{"dimension":"country","role":"Rows","collection":["AFG","AGO","ALB"]},
// 	{"dimension":"indicator","role":"Ignore","collection":[]},
// 	{"dimension":"year","role":"Columns","collection":[]}
// 	]
// }	