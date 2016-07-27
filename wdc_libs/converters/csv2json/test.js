// var Converter = require("csvtojson").Converter;
// var converter = new Converter({});
// converter.fromFile("./data.csv",function(err,result){
// 	console.log(result)
// });

var formatter = require("../../wdc-format")
formatter
	.csv2json("./data.csv")
	.then(function(result){
		console.log(result);
	})