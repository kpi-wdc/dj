var util = require("util");


module.exports = {
  name: "wrapHtml",
  synonims:{
    "wrapHtml" : "wrapHtml",
    "wrap" : "wrapHtml"
  },
  "internal aliases": {
    "tag" : "tag"
  },
  defaultProperty:{
    "wrapHtml":"tag",
    "wrap": "tag"
  },

  execute:function(command,state,config){
    state.head = {
      type: "html",
      data : "<"+command.settings.tag
              + ((command.settings["class"]) ? ' class="'+command.settings["class"]+'"' : "")
              + ((command.settings.style) ? ' style="'+command.settings.style+'"' : "")
              +">"+state.head.data+"</"+command.settings.tag+">"
    }  
  	return state;
  },

  help:{
    synopsis:"Wrap context into html tag",
    
    name:{
      "default" : "wrapHtml",
      synonims:["wrapHtml","wrap"]
    },
    input:["string", "html"],
    output:"html",
    "default param": "tag",
    
    params:[{
            name: "tag",
            synopsis: "Wrapper tag name (required)",
            type:["string"],
            synonims: [],
            "default value": "none"
        },
        {
            name: "style",
            synopsis: "Wrapper inline css style (optional)",
            type:["string"],
            synonims: [],
            "default value": "none"
        },
        {
            name: "class",
            synopsis: "Wrapper class (optional)",
            type:["string"],
            synonims: [],
            "default value": "none"
        }
        ],
    
    example:{
      description:"Build HTML table",
      code:   '<%\n'+
              'var mapRow = function(d){\n'+
              '  return "<tr>"+ d.value.map(function(v){\n'+
              '     return \'<td style="font-size:x-small">\'+v+"</td>"\n'+
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