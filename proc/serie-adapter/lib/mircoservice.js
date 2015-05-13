var http = require('http');



var MicroService = function(request){
    this.request = request;
}

MicroService.prototype = {
  execute : function (callback){
    var options = {
      host: '127.0.0.1',
      port: 8080,
      path: '/api/data/process/',
      method: 'POST'
    };
    var req = http.request(options, function(res) {
      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        var resultObject = JSON.parse(responseString);
        if ( callback ) callback(resultObject)
      });
    });

    req.on('error', function(e) {
      // TODO: handle error.
    });

    req.write(JSON.stringify(this.request));
    req.end();
  }
}

exports = MicroService;