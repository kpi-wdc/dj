console.log("Load test")
var script = require("./index.js")
var fs = require("fs");


var example = fs.readFileSync("./multiscript.dps").toString()
var s = (new script())
          .config(require("./dps-config"))
          .script(example)
          .run()
          .then(function(result){
            console.log("SCRIPT RESULT: ", JSON.stringify(result))
          })
          .catch(function(error){
               console.log("SCRIPT ERROR: ", error)
          })


