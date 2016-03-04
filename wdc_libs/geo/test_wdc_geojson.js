var geodata = require("./wdc-geojson").geodata;

geodata.forEach(function(item){
	if(!item.properties)
	console.log("!!!")	
	console.log(JSON.stringify(item))
})