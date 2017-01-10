module.exports = {
  name: "context",
  synonims:{
    "context" : "context",
    "ctx" : "context"
  },

  "internal aliases":{
      "v":"value",
      "val":"value",
      "value":"value",
      "message":"value",
      "msg":"value"
  },
  
  defaultProperty:{
    "context" : "value",
    "ctx" : "value"
  },

  execute:function(command,state){
    try{
      state.head = {
        type: typeof command.settings.value,
        data: command.settings.value  
      }
    } catch(e) {
      throw e.toString()
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
    input:["any"],
    output:"Type of parameter 'value'",
    params:[
      {
        name:"value",
        synopsis:"Value will be stored in context",
        type:["string","number","bindable","injection"],
        synonims:[],
        "default value": "none"
      }
    ],
    example:{
      description:"Put string 'Hello' into context",
      code:"context(value:'Hello')\n//or with synonims and defaults\nctx('Hello')\ninfo()\n//or with injection\n<% Hello %>\n//or get string from var\ninfo()\nset('helloStr')\nctx('{{helloStr}}')\ninfo()\nlog()"
    }

  }
}