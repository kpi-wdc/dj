var query = require("./wdc-query");
var XLSX = require("node-xlsx");
var fs = require("fs");


var prepare = function (dataset,selection){



var getIDList = function(metadata,selection){
	// console.log(metadata.dimension[selection.dimension])
	return new query()
		.from(metadata.dimension[selection.dimension].values)
		.select(function(item){
			if (selection.collection.length == 0) return true;
			return new query()
				.from(selection.collection)
				.select(function(current){return current == item.id;})
				.length() == 1
		})
		.get() 
}

var getDimensions = function(selection, role){
	return new query()
			.from(selection)
			.select(function(item){
				return item.role == role
			})
			.get();
}


var rowsDimension = getDimensions(selection,"Rows")[0];
var columnsDimension = getDimensions(selection,"Columns")[0];
var splitRowsDimensions = getDimensions(selection,"Split Rows");
var splitColumnsDimensions = getDimensions(selection,"Split Columns");


rowsDimension.IDList = getIDList(dataset.metadata,rowsDimension);
columnsDimension.IDList = getIDList(dataset.metadata,columnsDimension);
splitRowsDimensions.forEach(function(current){
	current.IDList = getIDList(dataset.metadata,current);
})
splitColumnsDimensions.forEach(function(current){
	// console.log(current);
	current.IDList = getIDList(dataset.metadata,current);
})




  var result = dataset.data.filter(function(row){
	  var r = true;
	  new query()
	  .from(selection)
	  .select(function(item){
	  	return item.role !="Disable"
	  })
	  .get()
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

// console.log(result)


var product = [];

rowsDimension.IDList.forEach(function(row){
	var metadata = row;
	metadata.dimension = rowsDimension.dimension;
	metadata.dimensionLabel = dataset.metadata.dimension[metadata.dimension].label;
	metadata.role = dataset.metadata.dimension[metadata.dimension].role; 
	var resultRow = {metadata:[metadata], value:[]};
	var rowData = new query()
		.from(result)
		.select(function(item){
			return item["#"+rowsDimension.dimension] == row.id
		})
		.get();
	resultRow.data = rowData;
	product.push(resultRow);
})



var splitRow = function(data,dimension){
	var r = [];
	data.forEach(function(rowset){
		dimension.IDList.forEach(function(current){
			var m = current;
			m.dimension = dimension.dimension;
			m.dimensionLabel = dataset.metadata.dimension[m.dimension].label; 
			m.role = dataset.metadata.dimension[m.dimension].role; 
			var c = {metadata:rowset.metadata.map(function(item){return item})};
			c.metadata.push(m);
			c.data = new query()
						.from(rowset.data)
						.select(function(item){return item["#"+dimension.dimension] == current.id})
						.get();
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
			m.dimensionLabel = dataset.metadata.dimension[m.dimension].label;  
			m.role = dataset.metadata.dimension[m.dimension].role; 
			
			var c = {metadata:colset.metadata.map(function(item){return item})};
			c.metadata.push(m);
			c.data = new query()
						.from(colset.data)
						.select(function(item){return item["#"+dimension.dimension] == current.id})
						.get();
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
		m.dimensionLabel = dataset.metadata.dimension[m.dimension].label;  
		m.role = dataset.metadata.dimension[m.dimension].role; 
		columnes.push(
			{
				metadata:[m],
				data: new query()
						.from(row.data)
						.select(function(item){
							return item["#"+columnsDimension.dimension] == currentColumnSet.id
						})
						.get()
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
		row.value.push((col.data.length>0)?col.data[0]["#value"]*1:null)
	})
})



var body = product
	.filter(function(row){
		return row.value.filter(function(item){return item ==null}).length < row.value.length
	})
	.map(function(row){
		return {metadata:row.metadata, value:row.value}
	});

var header = product[0].columnes.map(function(col){
	return {metadata:col.metadata}
})

  return {header:header,body:body};
}

prepareXLS = function(gen){
	var product = [{name:"data",data:[]},{name:"metadata", data:[]}];
	var dummyHeader = [];
	for(i in gen.body[0].metadata){dummyHeader.push(null)}
	
	for(i in gen.header[0].metadata){
		product[0].data
			.push( 
				dummyHeader.concat(
					new query().
					from(gen.header)
					.map(function(item){return item.metadata[i].label})
					.get()
				)
			)
	}

	gen.body
	.map(function(item){
			return item.metadata.map(function(c){return c.label}).concat(item.value)
	})
	.forEach(function(item){
		product[0].data.push(item)				
	});

	product[1].data.push(["key", "value", "note"]);
	product[1].data.push(["type", gen.metadata.type, null]);
	
	product[1].data.push(["source", gen.metadata.source.dataset.id, gen.metadata.source.dataset.label]);
	
	gen.metadata.selection.forEach(function(item){
		var s ="";
		var labels = [];
		if(item.IDList){
			item.IDList.forEach(function(c){
				labels.push(c.label)
			});
			s+=item.IDList[0].dimensionLabel+" : "+labels.join(", ")+" as "+item.role;
		}
		s = ("") ? null : s;
		product[1].data.push(["selection", s, null]);
	});
	

   return XLSX.build(product);
}

buildXLS = function(dataset,selection){
	var gen = prepare(dataset,selection);
	var product = {name:"data",data:[]};
	var dummyHeader = [];
	for(i in gen.body[0].metadata){dummyHeader.push(null)}
	
	for(i in gen.header[0].metadata){
		product.data
			.push( 
				dummyHeader.concat(
					new query().
					from(gen.header)
					.map(function(item){return item.metadata[i].label})
					.get()
				)
			)
	}

	gen.body
	.map(function(item){
			return item.metadata.map(function(c){return c.label}).concat(item.value)
	})
	.forEach(function(item){
		product.data.push(item)				
	});
   return XLSX.build([product]);
}

var saveXLS = function(filename,dataset,selection){
	 fs.writeFileSync(filename, buildXLS(dataset, selection));
}


exports.prepare = prepare;
exports.buildXLS = buildXLS;
exports.saveXLS = saveXLS;
exports.prepareXLS = prepareXLS;