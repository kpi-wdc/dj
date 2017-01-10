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
        type:["string","number","bindable","injection"],
        synonims:[],
        "default value": "current context"
      }],
    
    example:{
      description:"Logger info",
      code:"info(value:'Direct')\n<%Hello injection! %>info()\nset('helloStr')\ninfo('From var')\ninfo('{{helloStr}}')\nlog()"
    }
  }
}