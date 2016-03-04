var ua = require("./ua.geo").ua_geojson;
var world = require("./world.geo").world_geojson.features;

console.log("exports.geodata = "+JSON.stringify(ua.concat(world)))
// console.log("exports.geodata = "+JSON.stringify(world.concat(ua)))