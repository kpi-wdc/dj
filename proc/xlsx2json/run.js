var xlsxJsonParser = require('./index');

var args = process.argv.slice(2);
var jsonAndHash = xlsxJsonParser.get(args[0]);

process.stdout.write(jsonAndHash[0] + "|" + jsonAndHash[1]);
