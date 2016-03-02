var geodata = require("./wdc-geojson").geodata;

geodata.forEach(function(item){
	console.log(JSON.stringify(item.properties))
})