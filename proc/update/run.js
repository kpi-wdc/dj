process.on('message', function (json) {
  delete json.hash;
  delete json.isDataSource;
  delete json.id;

  var params = json.params;
  var data = json.data;
  var res = {};
  res.createdAt = data.createdAt;

  for(var key1 in data) {
    if (data.hasOwnProperty(key1)) {
      res[key1] = data[key1];
    }
  }

  for(var key2 in params) {
    if (params.hasOwnProperty(key2)) {
      res[key2] = params[key2];
    }
  }

  process.send(res);
  process.exit(0);
});
