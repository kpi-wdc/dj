var fs = require("fs");
var topojson = require("./topojson").topojson;
// var d3 = require("./d3").d3;
var topology = require("./ua.topo").ua_topology;
var util = require("util")
// console.log(d3)


// var data = fs.readFileSync("./data/ua_4.topo.json");


// var num = 2;
// var delta =50000; 


// function test(g){
// 	if(!util.isArray(g)) return false;
// 	var f = true;
// 	for(var i=0; i<g.length; i++){
// 		if((g[i].length != 2) || (isNaN(new Number(g[i][0]))) || (isNaN(new Number(g[i][1]))))
// 		return false;  
// 	}
// 	return true;
// }

// function testEq(a,b){
// 	// console.log(((a[0]-b[0])*(a[0]-b[0])+(a[1]-b[1])*(a[1]-b[1])))
// 	return ((a[0]-b[0])*(a[0]-b[0])+(a[1]-b[1])*(a[1]-b[1]))<delta
// 	// return (Math.abs(a[0]-b[0])<delta) && (Math.abs(a[1]-b[1])<delta) 
// }


// function reduce(g){
// 	// console.log(g)
// 	g.forEach(function(a){
// 		var i = 0;
// 		while(i < a.length){
// 			// if(i>0)	console.log(testEq(temp1[i],temp1[i-1]),JSON.stringify(temp1[i]),JSON.stringify(temp1[i-1]))
// 			if( (i>1) && 
// 				// testEq(new Number(a[i]),new Number(a[i-1]))
// 				testEq(a[i],a[i-1])
// 			){
// 				a.splice(i,1)
// 			}else{
// 				i++
// 			}
// 		}
// 	})
// 	return g;
// }



// // var index = [0];
// // function reduce(g){
// // 	var f = test(g);
// // 	// console.log(f)
// // 	if(f){
// // 		var temp1 = g.map(function(item){return item});
// // 		var i = 0;
// // 		while(i < temp1.length){
// // 			// if(i>0)	console.log(testEq(temp1[i],temp1[i-1]),JSON.stringify(temp1[i]),JSON.stringify(temp1[i-1]))
// // 			if( (i>0) && testEq(temp1[i],temp1[i-1])){
// // 				temp1.splice(i,1)
// // 			}else{
// // 				i++
// // 			}
// // 		}
// // 		return temp1;
// // 	}

// // 	var temp = g.map(function(item){return item})
	
// // 	for(var i in temp ){
// // 		index.push(i);
// // 		g[i] = reduce(temp[i]);
// // 		i = index.pop()
// // 	}
// // 	return g;
// // }





// var topodata = JSON.parse(data)
// var arcs = topodata.arcs.map(function(item){return item})
// arcs = reduce(arcs)
// topodata.arcs = arcs; 

// console.log(JSON.stringify(topodata));

var geom = topojson.feature(topology, topology.objects.admin_level_4);

var outData = geom.features.map(function(item){
	return {
		type:item.type,
		id:item.id,
		properties:{ 
			geocode:[
				item.properties["ISO3166-2"],
				item.properties["name:uk"].split(" ")[0],
				item.properties["name:en"].split(" ")[0],
				item.properties["name:ru"].split(" ")[0]
				
			],
			name:{
				uk:item.properties["name:uk"].split(" ")[0],
				en:item.properties["name:en"].split(" ")[0],
				ru:item.properties["name:ru"].split(" ")[0]
			},
			scope:["Ukraine"]
		},
		geometry:item.geometry	
	}
})

var crimea = outData.filter(function(item){
	return item.properties.name.en == "Autonomous" })[0];

crimea.properties.geocode = [
	crimea.properties.geocode[0],
	"Crimea","АР Крым", "АР Крим","Крым", "Крим" 
]

crimea.properties.name = {
	uk:"Крим",
	en:"Crimea",
	ru:"Крым"
}; 

var kiev = outData.filter(function(item){
	return item.properties.name.uk == "Київ" })[0];

kiev.properties.geocode = [
	crimea.properties.geocode[0],
	"Київ","м.Київ", "Kyiv","Киев", "г.Киев" 
]

kiev.properties.name = {
	uk:"м.Київ",
	en:"Kyiv city",
	ru:"г.Киев"
}; 


var sev = outData.filter(function(item){
	return item.properties.name.uk == "Севастополь" })[0];

sev.properties.geocode = [
	crimea.properties.geocode[0],
	"Севастополь","м.Севастополь","г.Севастополь","Sevastopol"
]
sev.properties.name = {
	uk:"м.Севастополь",
	en:"Sevastopol",
	ru:"г.Севастополь"
}; 


outData = outData.filter(function(item){
	return (item.properties.geocode[0] && item.properties.geocode[0].indexOf("UA")==0) && 
		item.properties.name.en != "Autonomous Republic of Crimea" &&
		item.properties.name.uk != "Київ" &&
		item.properties.name.uk != "Севастополь" 

})
// outData = [crimea,kiev,sev].concat(outData)

outData.push(crimea);
outData.push(kiev);
outData.push(sev);


// util = require("util")
//// simplify geometry
// var index = [0];
// function simplify(g){
// 	if(!isNaN(new Number(g))){
// 		return new Number(new Number(g).toFixed(num));
// 	}
// 	var temp = g.map(function(item){return item})
// 	for(var i in temp ){
// 		index.push(i);
// 		g[i] = simplify(temp[i]);
// 		i = index.pop()
// 	}
// 	return g;
// }



// outData.forEach(function(item){
// 	item.geometry.coordinates = simplify(item.geometry.coordinates)
// })

// outData.forEach(function(item){
// 	item.geometry.coordinates = reduce(item.geometry.coordinates)
// })

// outData[0].geometry.coordinates = simplify(outData[0].geometry.coordinates);
// outData[0].geometry.coordinates = reduce(outData[0].geometry.coordinates);

console.log("exports.ua_geojson = "+JSON.stringify(outData))