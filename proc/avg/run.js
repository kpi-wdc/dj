var Stats = require('fast-stats').Stats;

process.on('message', function (msg) {
  var values = msg.data.values;
  var params = msg.params;
  if (!values) {
    process.stderr.write("Input value must be an array");
    process.exit(1);
  }
  var s = new Stats().push(values);
  if (params.precision < 0 || params.precision > 20) {
    process.stderr.write("Precision must be a value in range [0; 20]");
    process.exit(2);
  }
  process.send({mean : s.amean().toFixed(params.precision)});
  process.exit(0);
});
