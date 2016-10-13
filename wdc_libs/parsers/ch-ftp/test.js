require("./index")("./nsms_gdr.xlsx")
	.then(function(r){
		console.log(JSON.stringify(r))
	});



// 	
// var Coder = require("../../wdc-coder");

// var c = Coder();

// ["a","b","c"]

// for(var i=0; i<10; i++) c.push("v"+i)

// for(var i=0; i<10; i++) console.log(i, c.decode(i))

// for(var i=0; i<10; i++) console.log("v"+i, c.encode("v"+i))

// var c1 = Coder();
// c1.push(["a","b","c"])
// for(var i=0; i<4; i++) console.log(i, c1.decode(i))

// console.log("a", c1.encode("a"))	
// console.log("z", c1.encode("z"))	