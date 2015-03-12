var xlsxJsonParser = require('./index');

var args = process.argv.slice(2);
var json = xlsxJsonParser.get(args[0]);

process.stdout.write(json);
