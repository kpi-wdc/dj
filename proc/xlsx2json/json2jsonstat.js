var xlsxJsonParser = require('./index');

process.on('message', function (json) {
  delete json.hash;
  delete json.isDataSource;
  delete json.createdAt;
  delete json.updatedAt;
  delete json.id;
  var jsonStat = xlsxJsonParser.toJSONSTAT(json);
  process.send(jsonStat);
  process.exit(0);
});
