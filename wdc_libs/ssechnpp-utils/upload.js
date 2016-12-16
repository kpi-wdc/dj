var http = require('request-promise');
var logger = require("../wdc-log").global;
var fs = require("fs");
var datasetGroupParser =  require("../parsers/ch-ftp");
var Promise = require("bluebird");


// var host = 'https://dj-dps.herokuapp.com';
var host = 'http://localhost:8088';
// var srcDir = './dsrc';
var srcDir = './new data';

var updateDataset = function(ds){
	var options = {
		method: "PUT",
		uri: host + "/api/import/datasets",
		body: ds,
		json: true	
	}

	return http(options);
}

var processDatasetGroup = function(datasetGroup){
	return new Promise(function (resolve,reject){
		Promise.reduce(datasetGroup, function(c,dataset, index){
			  			
						return new Promise(function (resolve,reject){

							logger.info(index+" Process dataset "+dataset.metadata.dataset.id)
				  			dataset.metadata.dataset.commit.author = "internal actor";
					        delete dataset.dictionary;
					        updateDataset(dataset)
					        		.then(function (resp){
										logger.success(resp)
										resolve()
									})
									.catch(function(err){
										logger.error(err)
										reject()
									})

						})
		},0).then(function(){resolve()})	
	})
}


logger.success("SEE ChNPP dataset utility start")
logger.success("Source dir "+srcDir);



fs.readdir(srcDir, function(err, files) {
	

	Promise.reduce(files, function(s, file){
		
		return new Promise(function(resolve,reject){
			file = srcDir+"/"+file
    		logger.success ("Process "+file);
    		
    		datasetGroupParser(file)
			  	.then(function(datasetGroup){
			  		processDatasetGroup(datasetGroup)
			  			.then(function(){
			  				resolve()
			  			})
			  	})
			})
	},0)
		.then(function(){
			logger.success("Operation complete")
		})
})

