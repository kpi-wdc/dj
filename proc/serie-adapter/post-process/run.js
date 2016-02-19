var generate = require("../index").PostProcess;


process.on('message', function (json) {
	
  delete json.hash;
  delete json.isDataSource;
  delete json.id;

  process.send(generate(json.data,json.params));
  // process.send(json.data)
  process.exit(0);
});
