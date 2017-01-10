var logger = require("../../../log");




module.exports = {
  name: "logger",
  synonims:{
    "log":"logger"
  },
  
  defaultProperty:{},

  execute:function(command,state,config){
  	state.logger = state.logger || logger.local();
    state.head = {
      type:"log",
      data: state.logger.get()
    }
    return state;
  },

  help:{
    synopsis:"Puts logger messages into context",
    
    name:{
      "default" : "logger",
      synonims:["logger","log"]
    },
    
    "default param": "none",
    input:["any"],
    output:"log",
    
    params:[],
    
    example:{
      description:"Logger info",
      code:"info(value:'Direct')\n<%Hello injection! %>info()\nset('helloStr')\ninfo('From var')\ninfo('{{helloStr}}')\nlog()"
    }
  }
}