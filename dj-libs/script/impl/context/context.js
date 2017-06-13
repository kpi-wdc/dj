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
      synonims:["ctx", "context"]
    },
    "default param": "value",
    input:["any"],
    output:"Type of parameter 'value'",
    params:[
      {
        name:"value",
        synopsis:"Value will be stored in context",
        type:["string","number","bindable","injection"],
        synonims:["v", "val", "value"],
        "default value": "none"
      }
    ],
    example:{
      description:"Put string 'Hello' into context",
      code:"context(value:'Hello')\r\n\r\n//or with synonims and defaults\r\nctx('Hello')\r\nset('b')\r\ninfo()\r\n\r\n//or with injection\r\n<?text Hello ?>\r\n\r\n//or get string from var\r\ninfo()\r\nset('a')\r\nctx({{a}})\r\ninfo()\r\nctx({{b}})\r\ninfo()\r\n\r\nlog()\r\n"
    }



    

  }
}