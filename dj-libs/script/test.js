
var script = require("./index.js")
var fs = require("fs");
var vm = require('vm');

var promiseCommand = {
  name:"promise",
  synonims:{
    "promise" : "promise",
    "q": "promise"
    },
  defaultProperty:{},
  execute: function(command,state){
    var Promise = require("bluebird");
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        state.head = {
          type:"promise",
          data:"promise"
        }
        resolve(state)
      },2000)
    })
  }
}


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


