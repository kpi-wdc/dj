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
      code:"\r\ninfo(value:'Direct')\r\n\r\n<?text\r\n    Hello injection! \r\n?>\r\n\r\ninfo()\r\nset('helloStr')\r\ninfo('From var')\r\ninfo({{helloStr}})\r\n\r\nlog()\r\n"
    }
  }
}