var Promise = require("bluebird");
var fs = require("fs");

  

module.exports = function (config){
	return new Promise(function(resolve,reject){
		var files = fs.readdirSync(config.dest);
		files.forEach(function(file){
			fs.unlinkSync(config.dest+file)
			// console.log("delete "+config.dest+file);
		})
		resolve();	
	})
}


