var XLSX = require("node-xlsx");
var util = require("util");
var query = require("../../wdc-query");
var flat = require("../../wdc-flat");
var mime = require('mime');
var converter = require("../../wdc-xlsx-converter");
var logger = require("../../wdc-log").global;

var isWdcTable = function(data){
	return data.header && data.body && data.metadata
}
var isWdcSource = function(data){
	return 	(data.metadata 
			&& data.metadata.dataset 
			&& data.metadata.dimension
			&& data.metadata.layout
			&& data.data)
}

var exportWdcSource = function(data){
	logger.debug("EXPORT SOURCE")
	return converter.json2xlsx(data)
}



var exportWdcTable = function(gen){

	logger.debug("EXPORT TABLE")

	var product = [{ name: "data", data: [] }, { name: "metadata", data: [] }];
	var dummyHeader = [];
	for (i in gen.body[0].metadata) { dummyHeader.push(null) }

	for (i in gen.header[0].metadata) {
	    product[0].data
	        .push(
	            dummyHeader.concat(
	                new query().from(gen.header)
	                .map(function(item) {
	                    return item.metadata[i].label })
	                .get()
	            )
	        )
	}

	gen.body
	    .map(function(item) {
	        return item.metadata.map(function(c) {
	            return c.label }).concat(item.value)
	    })
	    .forEach(function(item) {
	        product[0].data.push(item)
	    });

	product[1].data.push(["key", "value", "note"]);
	product[1].data.push(["type", gen.metadata.type, null]);

	product[1].data.push(["source", gen.metadata.source.dataset.id, gen.metadata.source.dataset.label]);

	gen.metadata.selection.forEach(function(item) {
	    var s = "";
	    var labels = [];
	    if (item.IDList) {
	        item.IDList.forEach(function(c) {
	            labels.push(c.label)
	        });
	        s += item.IDList[0].dimensionLabel + " : " + labels.join(", ") + " as " + item.role;
	    }
	    s = ("") ? null : s;
	    product[1].data.push(["selection", s, null]);
	});
	return product;
	// return XLSX.build(product);
}

var exportArray = function(data){

	logger.debug("EXPORT ARRAY")

	var product = [{ name: "data", data: [] }]
	
	product[0].data.push(
		flat.json2flat(data[0]).map(function(item){return item.path})
	)

	data.forEach(function(row){
		product[0].data.push(
			flat.json2flat(row).map(function(item){ return item.value})
		)
	})

	return product;
}

var exportObject = function(data){

	logger.debug("EXPORT OBJECT")

	data = flat.json2flat(data);
	var product = [{ name: "data", data: [] }]
	product[0].data.push(["key","value"])
	data.forEach(function(row){
		product[0].data.push([row.path, row.value])
	})

	return product;
}





module.exports = function(data, params, locale, script, scriptContext){

	logger.debug("EXPORT XLSX")

    if(isWdcSource(data)){
    	 fs.writeFileSync("./.tmp/public/downloads/"+params.file, XLSX.build(exportWdcSource(data)));
    	 return {url:"/downloads/"+params.file} 
    }
	if(isWdcTable(data)){ 
		fs.writeFileSync("./.tmp/public/downloads/"+params.file, XLSX.build(exportWdcTable(data)));
    	return {url:"/downloads/"+params.file} 
   }
	if(util.isArray(data))	{ 
		fs.writeFileSync("./.tmp/public/downloads/"+params.file, XLSX.build(exportArray(data)));
    	return {url:"/downloads/"+params.file} 
	}
	if(util.isObject(data))	{ 
		fs.writeFileSync("./.tmp/public/downloads/"+params.file, XLSX.build(exportObject(data)));
    	return {url:"/downloads/"+params.file} 
	}
	return {error:"xlsx converter not founded"};	
}