var util = require("util");
module.exports = {
  name: "string",
  synonims:{
    "string" : "string",
    "str" : "string"
  },
  
  defaultProperty:{},

  execute:function(command,state,config){
    try{  
      state.head = {
        data: JSON.stringify(state.head.data),
        type: "string"
  		}
  	}catch(e){throw e}   
    
	 return state;
  },

  help:{
    synopsis:"Convert script context to string",
    
    name:{
      "default" : "string",
      synonims:["string","str"]
    },
    input:["json"],
    output:"string",

    "default param": "none",
    
    params:[],
    
    example:{
      description:"Convert string value '[1,1,1]' to string value '[1,1,1]'",
      code:"<%[1,1,1]%>\njson()\n str()\ninfo()\nlog()"
    }
  }
}