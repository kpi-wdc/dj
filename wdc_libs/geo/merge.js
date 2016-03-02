var ua = require("./output/ua4s").geodata;
var world = require("./output/world").geodata;

console.log("exports.geodata = "+JSON.stringify(ua.concat(world)))
// console.log("exports.geodata = "+JSON.stringify(world.concat(ua)))