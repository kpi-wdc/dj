var parser = require("./parser");
var script = require("./script")
var fs = require("fs");

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
          .config([
            require("./impl/help"), 
            require("./impl/context"), 
            require("./impl/var/set"), 
            require("./impl/var/get"), 
            promiseCommand])
          .script(example)
          .run()
          .then(function(result){
            console.log("SCRIPT RESULT: ", result)
          })
          .catch(function(error){
               console.log("SCRIPT ERROR: ", error)
          })


