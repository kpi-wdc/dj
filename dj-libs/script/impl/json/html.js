var util = require("util");


module.exports = {
  name: "html",
  synonims:{},
  
  defaultProperty:{},

  execute:function(command,state,config){
    state.head.type = "html"
  	return state;
  },

  help:{
    synopsis:"Set 'html' type for contet",
    
    name:{
      "default" : "html",
      synonims:[]
    },
    input:["string"],
    output:"html",
    "default param": "none",
    
    params:[],
    
    example:{
      description:"Build HTML table",
      code:   '<%\n'+
              'var mapRow = function(d){\n'+
              '  return "<tr>"+ d.value.map(function(v){\n'+
              '     return "<td style=\\"font-size:x-small\\">"+v+"</td>"\n'+
              '  }).join("")\n'+
              '}\n'+
              '\n'+
              '%>\n'+
              'js()set("cb")\n'+
              '\n'+
              '\n'+
              '<%\n'+
              'map("{{cb.mapRow}}")\n'+
              'concat()\n'+
              'html()\n'+
              'wrapHtml("table")\n'+
              '%>\n'+
              '\n'+
              'dps()set("t2html")\n'+
              '\n'+
              '\n'+
              '\n'+
              'src(ds:"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02")\n'+
              'json()\n'+
              'dataset()\n'+
              'proj([{dim:"time", as:"row"},{dim:"indicator",as:"col"}])\n'+
              'format(2)\n'+
              'json()\n'+
              'select("$.body.*")\n'+
              'run("{{t2html}}")'
    }
  }
}