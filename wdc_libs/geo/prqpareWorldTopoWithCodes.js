var fs = require("fs");
var topojson = require("./topojson").topojson;
var topology = require("./world.topo").topology;
var scopes = require("./geo-scope").geo_scope;
var codes = require("./geo-code").geo_codes;

var array = require('lodash-node/modern/array');
var object = require('lodash-node/modern/object');



topology.objects.world.geometries.forEach(function(item){
	var codeIndex = array.findIndex(codes, function(c){return c.iso3 == item.id})
	if(codeIndex >= 0){
		item.properties.geocode = object.values(codes[codeIndex]);
		item.properties.iso2 = codes[codeIndex].iso2;
		item.properties.name = {
			en : codes[codeIndex].en,
			uk : codes[codeIndex].uk,
			ru : codes[codeIndex].ru
		}
	}

	var scopeIndex = array.findIndex(scopes, function(s){
		return array.findIndex(s.countries, function(cn){
			return cn.iso2 == item.properties.iso2;
		}) >= 0
	})

	if(scopeIndex >=0){
		item.properties.scope = scopes[scopeIndex].scope.map(function(c){return c.name})
	}else{
		item.properties.scope = ["World"];
	}

})




// console.log(JSON.stringify(topology));


// var d3 = require("./d3").d3;

// console.log(array.findIndex(codes, function(o) { return o.iso2 == 'UA'; }))

// console.log(topology)


// var data = fs.readFileSync("./data/ua_4.topo.json");

// var topodata = JSON.parse(data)
 var geom = topojson.feature(topology, topology.objects.world);
console.log("exports.world_geojson = "+JSON.stringify(geom))

// var outData = geom.features.map(function(item){
// 	return {
// 		type: item.type,
// 		id:item.id,
// 		properties:{ 
// 			geocode:[
// 				item.id,
// 				item.properties.name
// 			],
// 			name:{
// 				uk:item.properties.name,
// 				en:item.properties.name,
// 				ru:item.properties.name
// 			},
// 			level: 0
// 		},
// 		geometry:item.geometry	
// 	}
// })




// console.log(JSON.stringify(outData))