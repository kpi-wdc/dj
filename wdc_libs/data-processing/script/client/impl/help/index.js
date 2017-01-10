module.exports = {
  name: "help",
  synonims:{
    "help" : "help",
    "h" : "help"
  },
  defaultProperty:{
    "help" : "command",
    "h" : "command"
  },

  execute:function(command,state,config){
    command.settings.command = command.settings.command || "help"; 
    
    var c = config.filter(function(cmd){
      return cmd.name == command.settings.command || cmd.synonims[command.settings.command] 
    })[0]

    if(!c){
      state.head = {
        type: "help",
        data: "Command '"+command.settings.command+"' not implemented"  
      }  
    }else{
      if(!c.help){
        state.head = {
          type: "help",
          data: "Command '"+command.settings.command+"' found but help not exists"  
        }    
      }else{
        state.head = {
          type: "help",
          data: c.help  
        }
      }
    }
    return state;
  },

  help:{
    synopsis:"Helps for command usage",
    name:{
      "default" : "help",
      synonims:["h"]
    },
    "default param": "command",
    params:[
      {
        name:"command",
        synopsis:"Command name for help",
        synonims:[],
        "default value": "help"
      }
    ],
    example:{
      description:"Set string 'Hello' into context",
      code:"help(command:'context')\\n or with synonims and defaults h()"
    }
  }
}