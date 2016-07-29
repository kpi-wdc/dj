// var fs = require('fs'),
//     xml2js = require('xml2js');

// var parser = new xml2js.Parser();
// fs.readFile('./2.xml', function(err, data) {
//     parser.parseString(data, function (err, result) {
//         // console.log(JSON.stringify(result));
//         for(var i=0; i<result.CompactData['wb:DataSet'].length;i++){ 
//         	console.log(JSON.stringify(result.CompactData['wb:DataSet'][i]));
//     	}
//     });
// });

var formatter = require("../../wdc-format")
formatter
	.xml2json("./2.xml")
	.then(function(result){
		console.log(result);
	})