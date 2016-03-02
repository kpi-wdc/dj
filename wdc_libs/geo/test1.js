var fs = require("fs");
var topojson = require("./topojson").topojson;
var topology = require("./world.topo").topology;
// var d3 = require("./d3").d3;


// console.log(topology)


// var data = fs.readFileSync("./data/ua_4.topo.json");

// var topodata = JSON.parse(data)
 var geom = topojson.feature(topology, topology.objects.world);
 // console.log(JSON.stringify(geom))

var outData = geom.features.map(function(item){
	return {
		type: item.type,
		id:item.id,
		properties:{ 
			geocode:[
				item.id,
				item.properties.name
			],
			name:{
				uk:item.properties.name,
				en:item.properties.name,
				ru:item.properties.name
			},
			level: 0
		},
		geometry:item.geometry	
	}
})




console.log(JSON.stringify(outData))