var mime = require("mime")
var path = require("path")
var logger = require("../../wdc-log").global;




var exportMap = {
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": require("./xlsx")
}


module.exports = function(data, params, locale, script, scriptContext){
	logger.debug("EXPORT "+JSON.stringify(params))
	var file = params.file;
	if(file){
		var type = mime.lookup(path.basename(file))
		logger.debug("MIME TYPE: "+type)
		if(exportMap[type]){
			scriptContext.$$mime = type;
			scriptContext.$$file = file;
			logger.debug("EXPORTER: "+exportMap[type])
			return exportMap[type](data, params, locale, script, scriptContext)
		}
	}

	return {error:"cannot export"};	
}