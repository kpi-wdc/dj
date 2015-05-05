var generate = require("../index").MapSerie;


process.on('message', function (json) {
  delete json.hash;
  delete json.isDataSource;
  delete json.id;

  if(!json.params){
 	process.stderr.write("Query not exists. Params:" + JSON.stringify(json.params))
  	process.exit(1);
  }

  var params = json.params.grad;

  process.send(generate(json.data,params));
  // process.send(json.data)
  process.exit(0);
});
