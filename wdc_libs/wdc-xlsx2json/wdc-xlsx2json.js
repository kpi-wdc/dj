var XLSX = require('xlsx');
var XLS = require('xlsjs');

convert = function(workbook){
	for(i in workbook.Sheets){
	 workbook.Sheets[i] = XLSX.utils.sheet_to_json(workbook.Sheets[i]);	
	}
	return workbook;
}

readXLS = function(filename) {
	// console.time(filename);
	// var workbook, worksheet, datasheet;
	try {
		var name = filename.split('.');
		if (name[name.length - 1] == 'xlsx')
			workbook = XLSX.readFile(filename);
		else workbook = XLS.readFile(filename);
		// var datasheet = workbook.Sheets['data'];
		// var worksheet = workbook.Sheets['metadata'];
		// if (datasheet == null || worksheet == null) {
		// 	process.stderr.write("Can't read sheets from file!");
		// 	process.exit(13);
		// 	return null;}
	} catch(e) {
		process.stderr.write(e.toString());
		process.exit(14);
		return null;}
	return workbook;
}	

exports.parseFile = readXLS;
exports.convert = convert;
