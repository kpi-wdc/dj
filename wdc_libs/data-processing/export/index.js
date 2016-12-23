var mime = require("mime")
var path = require("path")
var logger = require("../../wdc-log").global;
var fs = require("fs");


 if (!fs.existsSync("./.tmp/public/downloads/")) {
 		console.log("Create folder for downloaded files: ./.tmp/public/downloads/")
        fs.mkdirSync("./.tmp/public/downloads/");
    }

var exportMap = {
	"text/csv": require("./csv"),
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": require("./xlsx")
	
}


module.exports = function(data, params, locale, script, scriptContext){
	logger.debug("!!!EXPORT "+JSON.stringify(params))
	var filename = params.file;
	logger.debug("!!!FILE "+JSON.stringify(filename))

	if(filename){
		var mimeType = mime.lookup(path.basename(filename));
		logger.debug("!!!MIME "+ mimeType)

		var exporter = exportMap[mimeType]
		logger.debug("!!!EXPORTER "+ exporter)

		if(exporter){
			return exporter(data, params, locale, script, scriptContext)
		}else{
			return {error:"export "+filename+": cannot support mime type "+ mimeType};	
		}

	}else{
		return {error:"cannot export empty file"};	
	}



	
	// if(filename){
	// 	var type = mime.lookup(path.basename(filename));
	// 	var exporter = exportMap[type];
	// 	logger.debug("MIME TYPE: "+type+" "+exporter)
	// 	if(exporter){
	// 		logger.debug("EXPORTER: "+exporter)
	// 		return exporter(data, params, locale, script, scriptContext)
	// 	}else{
	// 		return {error:"export "+filename+" cannot support mime type "+ type};	
	// 	}
	// }else{
	// 	return {error:"cannot export to empty file"};	
	// }

	
}