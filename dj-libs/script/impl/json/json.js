var util = require("util");

var JsonImplError = function(message) {
    this.message = message;
    this.name = "Command 'json' implementation error";
}
JsonImplError.prototype = Object.create(Error.prototype);
JsonImplError.prototype.constructor = JsonImplError;



module.exports = {
  name: "json",
  synonims:{
    "json" : "json",
    "JSON" : "json"
  },
  
  defaultProperty:{},

  execute:function(command,state,config){
    try{  
      state.head = {
        data: (util.isString(state.head.data))
                ? JSON.parse(state.head.data)
                : JSON.parse(JSON.stringify(state.head.data)),
        type: "json"
  		}
  	}catch(e){
      throw new JsonImplError(e.toString())
    }   
    
	 return state;
  },

  help:{
    synopsis:"Convert script context to json object",
    
    name:{
      "default" : "json",
      synonims:["json","JSON"]
    },
    input:["json"],
    output:"json",
    "default param": "none",
    
    params:[],
    
    example:{
      description:"Convert string value '[1,1,1]' to array of numbers",
      code:"<%[1,1,1]%>\n json()"
    }
  }
}