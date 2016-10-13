var PromiseFtp = require('promise-ftp');
var Promise = require("bluebird");
var path = require("path");
var fs = require("fs");
var mm = require("minimatch");
  

module.exports = function (config){

  var ftp = new PromiseFtp();
  var files = [];
  var promises = []
  
  config.dest = config.dest || './'; 

  if (!fs.existsSync(config.dest)){
        fs.mkdirSync(config.dest);
  }

  // console.log(config)
  return ftp
	  .connect(config)
	  .then(function (serverMessage) {
	  	// console.log(serverMessage)
	    return ftp.list('/');
	  })
	  .then(function (list) {
	  	list.forEach(function(item){
	  		if(item.type == "d"){
	  			promises.push(ftp.list('/'+item.name).then(function(list){
	  				list
	  					.filter(function(f){
	  						return (f.type != 'd')
	  					})
	  					.forEach(function(f){
		  					f.path = '/'+item.name+'/'+f.name
		  				})
	  				files = files.concat(list)
	  			}))
	  		}
	  	})
	  
	    return Promise.all(promises).then(function(){ 
	    	files = files.map(function(f){return f.path})
	    	// console.log("File List:",files)
	    	var downloadedFiles = [];
	    	var patterns = config.patterns;
	    	var dest = config.dest; 
	    	if(patterns){
		    	if(patterns.forEach){
			    	patterns.forEach(function(pattern){
			    		downloadedFiles = downloadedFiles.concat(files.filter(mm.filter(pattern,{matchBase: true})))	
			    	})
		    	}else{
		    		downloadedFiles = downloadedFiles.concat(files.filter(mm.filter(patterns,{matchBase: true})))
		    	}
		    }else{
		    	downloadedFiles = files;
		    }	

	    	files = downloadedFiles;
	    	// console.log("File List:",files)
	    	promises = []
	    	files.forEach(function(f){
	    		promises.push(
	    			ftp
	    				.get(f)
	    				.then(function (stream) {
	    					// console.log("download "+f+" into "+dest+path.basename(f))
						    return new Promise(function (resolve, reject) {
						      stream.once('close', resolve);
						      stream.once('error', reject);
						      stream.pipe(fs.createWriteStream(dest+path.basename(f)));
					    	})
					    })	
	    		)
	    	})
	    	return Promise.all(promises).then(function(){
	    		return ftp.end()
	    	})	
	    });
	  });
}


