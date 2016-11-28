var Promise = require("bluebird");

var t = [3000,1000,2000,0,500,0]

Promise.reduce(t, function(s , time, index){
	console.log("process "+index+" with "+time)
	return new Promise(function(resolve){
		console.log("start "+ index)
		setTimeout(function(){
			console.log("resolve "+index)
			resolve()
		}, time)
	})
},0)
.then(function(){
	console.log("complete")
})