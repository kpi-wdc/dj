var copy = require("../../../../../wdc-deep-copy");
var apply = copy.apply;
var util = require("util");
var jp = require("jsonpath");

module.exports = {
  name: "set",
  symonims:{
    "set" : "set",
    "put" : "set",
    "let" : "set"
  },
  defaultProperty:{
    "set" : "var",
    "put" : "var",
    "let" : "var"  
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

    if(command.settings.var){
      if(   util.isUndefined(command.settings.value)
        ||  command.settings.value =="" 
        ||  command.settings.value =="$"){
        state.storage = apply(state.storage,{path:command.settings.var, value:copy(state.head.data)})
        // scriptContext[params.var] = copyObject(data);
        return state;
      }else{
        if(util.isString(command.settings.value)){
          state.storage = apply(state.storage,{path:command.settings.var, value:copy(getProperty(state.head.data,command.settings.value))})
          // scriptContext[params.var] = copyObject(getProperty(data,params.value));
          return state;
        }
        if(util.isArray(command.settings.value)){
          state.storage = apply(state.storage,{path:command.settings.var, value:[]})
          // scriptContext[params.var] = [];
          command.settings.value.forEach(function(item,index){
            state.storage = apply(state.storage,{path:command.settings.var+"["+index+"]", value:copy(getProperty(state.head.data,item))})
            // scriptContext[params.var].push(copyObject(getProperty(data,item)))
          })
          return state;
        }
        if(util.isObject(params.value)){
          state.storage = apply(state.storage,{path:command.settings.var, value:{}})
          //scriptContext[params.var] = {};
          for(var key in command.settings.value){
            state.storage = apply(state.storage,{path:command.settings.var+"."+key, value:copy(getProperty(state.head.data,command.settings.value[key]))})
            // scriptContext[params.var][key] = copyObject(getProperty(data,params.value[key]))
          }
          return state;
        } 

      }
    }else{
      return state;
    }
  }catch(e){
      throw("Set storage command implementation error: "+e.toString())
  }
  }
}