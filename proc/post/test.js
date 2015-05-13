var http = require('http');

var user = {
          "data_id": "5549da85441fbbbc25a0632a",
          "params": {
               "select": [
                {
                  "dimension":"year",
                  "collection": [],
                  "role": "Rows"
                },
                
                {
                  "dimension":"country",
                  "collection": ["UKR","RUS","USA"],
                  "role": "Columns"
                },
                {
                  "dimension":"indicator",
                  "collection": [],
                  "role": "Split Columns"
                }
              ],
              "r":Math.random()
            },
            "proc_name": "query",
            "response_type": "data_id"
          };

var userString = JSON.stringify(user);

var headers = {
  'Content-Type': 'application/json',
  'Content-Length': userString.length
};

var options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/api/data/process/',
  method: 'POST'
  // ,
  // headers: headers
};

// Setup the request.  The options parameter is
// the object we defined above.
var req = http.request(options, function(res) {
  // res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
    console.log("data")
    responseString += data;
    console.log(responseString);
  });

  res.on('end', function() {
    console.log("end")
    var resultObject = JSON.parse(responseString);
    console.log(responseString);
  });
});

req.on('error', function(e) {
  // TODO: handle error.
});

req.write(userString);
req.end();
