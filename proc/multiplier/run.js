process.on('message', function (msg) {
  var values = msg.data.values;
  var params = msg.params;
  if (isNaN(params.multiplier)) {
    process.stderr.write("Multiplier must be a number");
    process.exit(1);
  }
  for (var i = 0; i < values.length; i++) {
    if (isNaN(values[i])) {
      process.stderr.write("Value: '" + values[i] + "' (index=" + i + ") is not a number");
      process.exit(2);
    }
    values[i] *= params.multiplier;
  }
  process.send({values : values});
  process.exit(0);
});
