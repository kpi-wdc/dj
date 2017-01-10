
module.exports = {
  name: "dataset",
  synonims:{
    "dataset" : "dataset",
    "ds": "dataset"
  },
  defaultProperty:{},

  execute:function(command,state,config){
  	if(state.head.type != "json") throw "Incompatible context "+state.head.type+ " for command 'dataset'"
	state.head.type = "dataset";
   return state;
  },

  help:{
    synopsis:"Set 'dataset' type for script context",
    input:["json"],
    output:"dataset",
    name:{
      "default" : "dataset",
      synonims:["dataset", "ds"]
    },
    "default param": "none",
    params:[],
    example:{
      description:"Get dataset source and process it as dataset",
      code:"src(ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02')\njson()\ndataset()\nproj([{dim:'time', as:'row'},{dim:'indicator', as:'col'}])"
    }
  }
}

