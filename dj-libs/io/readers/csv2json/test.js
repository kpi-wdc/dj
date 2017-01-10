// var Converter = require("csvtojson").Converter;
// var converter = new Converter({});
// converter.fromFile("./data.csv",function(err,result){
// 	console.log(result)
// });

var script = "../../wdc-format";
var formatter = require(script)
formatter
	.csv2json("./data.csv")
	.then(function(result){
		console.log(result);
	})