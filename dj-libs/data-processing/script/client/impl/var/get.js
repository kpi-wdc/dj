var copy = require("../../../../../wdc-deep-copy");
var apply = copy.apply;
var util = require("util");
var jp = require("jsonpath");


module.exports = {
  name: "get",
  synonims:{
    "get" : "get"
  },
  defaultProperty:{
    "get" : "path",
  },
  execute:function(command,state){
  try{  
    var getProperty = function(d,path){
      var result = undefined;
      jp.apply(d,path, function(value){
        if(util.isUndefined(result)){
          result = value;
        }else{
          if(!util.isArray(result)){
            result = [result]
          }
          result.push(value)
        }
        return value
      })
      return result
    }

    if(   util.isUndefined(command.settings) 
      ||  util.isUndefined(command.settings.path) 
      ||  command.settings.path =="" 
      ||  command.settings.path=="$"){
      
      state.head={
        data: copy(state.storage),
        type: "json"
      }
      return state;
    }
    state.head={
        data: copy(getProperty(state.storage,command.settings.path)),
        type: "json"
      }
    return state
  }catch(e){
      throw("Get storage command implementation error:"+e.toString())
  }
  }
}