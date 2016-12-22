module.exports = {
  name: "context",
  symonims:{
    "context" : "context",
    "ctx" : "context"
  },
  defaultProperty:{
    "context" : "value",
    "ctx" : "value"
  },

  execute:function(command,state){
    state.head = {
      type: "json",
      data: command.settings.value  
    }
    return state;
  }
}