module.exports = {
  name: "context",
  synonims:{
    "context" : "context",
    "ctx" : "context"
  },
  defaultProperty:{
    "context" : "value",
    "ctx" : "value"
  },

  execute:function(command,state){
    // console.log(command.settings.value)
    state.head = {
      type: "json",
      data: command.settings.value  
    }
    return state;
  },

  help:{
    synopsis:"Sets script context",
    name:{
      "default" : "context",
      synonims:["ctx"]
    },
    "default param": "value",
    params:[
      {
        name:"value",
        synopsis:"String or number value will be stored in context",
        synonims:[],
        "default value": "none"
      }
    ],
    example:{
      description:"Set string 'Hello' into context",
      code:"context(value:'Hello')\n//or with synonims and defaults\n ctx('Hello')\n//or with injection\n<% Hello %>"
    }

  }
}