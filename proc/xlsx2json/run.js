var xlsxJsonParser = require('./index');

var args = process.argv.slice(2);
var json = xlsxJsonParser.get(args[0]);

// get name of the datasource
var dataSourceName;
for (dataSourceName in json) {
    if (json.hasOwnProperty(dataSourceName)) {
        break;
    }
}

var result = {};
result.name = dataSourceName;
result.metadata = {};
for(var prop in json[dataSourceName]) {
    if (prop !== "value") {
        result.metadata[prop] = json[dataSourceName][prop];
    } else {
        result.value = json[dataSourceName]["value"];
    }
}

process.send(result);
