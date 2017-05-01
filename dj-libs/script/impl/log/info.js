var logger = require("../../../log");




module.exports = {
  name: "info",
  synonims:{},
  
  "internal aliases":{
    "value": "value",
    "v": "value",
    "message": "value",
    "msg": "value"
  },
  
  defaultProperty:{
  	 	"info":"value"
 },

  execute:function(command,state,config){
  	state.logger = state.logger || logger.local();
    state.logger.info(
    	((command.settings.value) 
    		? JSON.stringify((command.settings.value))
    		: JSON.stringify((state.head))
    	)	
    )
    console.log("INFO "+((command.settings.value) 
        ? JSON.stringify((command.settings.value))
        : JSON.stringify((state.head))
      ))
    return state;
  },

  help:{
    synopsis:"Puts info message into logger ",
    
    name:{
      "default" : "info",
      synonims:[]
    },

    "default param": "value",
    input:["any"],
    output:"input context type",
    
    params:[{
        name:"value",
        synopsis:"Value of info message",
        type:["string","number","bindable","injection", "message", "msg"],
        synonims:["value", "v"],
        "default value": "current context"
      }],
    
    example:{
      description:"Logger info",
      code:"\r\ninfo(value:'Direct')\r\n\r\n<?text\r\n    Hello injection! \r\n?>\r\n\r\ninfo()\r\nset('helloStr')\r\ninfo('From var')\r\ninfo({{helloStr}})\r\n\r\nlog()\r\n"
    }
  }
}