// parser = require("../../wdc-xlsx2json");
// var workbook = parser.convert(parser.parseFile("./data.xlsx"));
// console.log(workbook.Sheets)
// 
var formatter = require("../../wdc-format")
formatter
	.xlsx2json("./data.xlsx")
	.then(function(result){
		console.log(result);
	})