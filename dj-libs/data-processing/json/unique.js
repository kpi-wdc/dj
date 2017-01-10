var query = require("../../../query/query");
var util = require("util")

module.exports = {
  name: "unique",
  synonims:{
    "unique" : "unique",
    "uniq" : "unique",
    "u" : "unique",
    "dist" : "unique",
    "distinct" : "unique"
  },
  defaultProperty:{},

  execute:function(command,state,config){
  	if(state.head.type != "json") throw "Incompatible context for command 'unique'"
	try{
		if(util.isArray(state)){
			var res = new query()
							.from(state.head.data)
							.distinct()	
							.get()
			state.head = {
		        data: res,
		        type: "json"
		    }
		}	
	}catch(e){throw e}   
    
	return state;
  },

  help:{
    synopsis:"Returns unique values from script context",
    
    name:{
      "default" : "unique",
      synonims:["unique","uniq","dist","distinct"]
    },
    "default param": "none",
    params:[],
    example:{
      description:"Returns one item into context",
      code:"<%[1,1,1]%>\n json()\n unique()"
    }
  }
}