var xlsxJsonParser = require('./index');

var args = process.argv.slice(2);
var json = xlsxJsonParser.readJSON(args[0]);
var result = xlsxJsonParser.getOBJECT(json);

process.send(result);
process.exit(0);
