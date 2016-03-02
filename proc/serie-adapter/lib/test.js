var Ordinal = require("./arrays").Ordinal;
var stat = require("./stat");

var a = [0,1,2,3,4,5,6,7,9]

var o = Ordinal(stat.min(a),stat.max(a),3);

a.forEach( function(item) {
	console.log(item,o(item))
});