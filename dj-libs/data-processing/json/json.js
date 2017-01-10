
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
  		        data: JSON.parse(JSON.stringify(state.head.data)),
  		        type: "json"
  		    }
  		}	
  	}catch(e){throw e}   
    
	 return state;
  },

  help:{
    synopsis:"Convert script context to json object",
    
    name:{
      "default" : "json",
      synonims:["json","JSON"]
    },

    "default param": "none",
    
    params:[],
    
    example:{
      description:"Convert string value '[1,1,1]' to array of numbers",
      code:"<%[1,1,1]%>\n json()"
    }
  }
}