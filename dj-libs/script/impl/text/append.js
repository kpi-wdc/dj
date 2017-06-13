var util = require("util");

var AppendImplError = function(message) {
    this.message = message;
    this.name = "Command 'append' implementation error";
}
AppendImplError.prototype = Object.create(Error.prototype);
AppendImplError.prototype.constructor = AppendImplError;


module.exports = {
  name: "append",
  synonims:{},
   "internal aliases": {
        // "value": "value"
    },

  defaultProperty:{
    "append" : "value"
  },

  execute:function(command,state,config){
    if (state.head.type != "string" && state.head.type != "html") 
            throw new AppendImplError("Incompatible context type: '" + state.head.type + "'.")
    if (!util.isString(state.head.data)) 
            throw new AppendImplError("Incompatible context type: '" + (typeof state.head.data)+"'.")
    
    
    try{  
      
      command.settings.value = (util.isString(command.settings.value))
                                  ? command.settings.value
                                  :JSON.stringify(command.settings.value) 
      state.head.data= state.head.data+command.settings.value;

  	}catch(e){
      throw new AppendImplError(e.toString)
    }   
    
	 return state;
  },

  help:{
    synopsis:"Convert script context to string",
    
    name:{
      "default" : "append",
      synonims:[]
    },
    input:["text"],
    output:"text",

    "default param": "value",
    
    params:[{
            name: "value",
            synopsis: "The meaning of the text",
            type:[],
            synonims: ["value"],
            "default value": "none"
        }],
    
    example:{
      description:"Convert string value '[1,1,1]' to string value '[1,1,1]'",
      code:"<?html\n    <h1>\n?>\nappend('hello')\nappend('</h1>')\n\n// or\n\n<?html hello ?>\nwrap('h1')\n"

    }
  }
}