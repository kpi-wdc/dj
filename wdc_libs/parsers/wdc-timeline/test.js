// console.log("start")
require("./index")("./timeline.xlsx")
	.then(function(r){
			console.log(JSON.stringify(r.data))	
	});