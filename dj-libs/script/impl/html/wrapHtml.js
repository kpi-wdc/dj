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
      code:   "<?javascript\r\n    \r\n    $context.rowMapper = function(d){\r\n      return \"<tr>\"+ d.value.map(function(v){\r\n         return \"<td style=\\\\\"font-size:x-small\\\\\">\"+v+\"</td>\"\r\n      }).join(\"\")+\"</tr>\"\r\n    };\r\n\r\n?>\r\n\r\n<?dps\r\n\r\n    map({{rowMapper}})\r\n    concat()\r\n    html()\r\n    wrapHtml(tag:\"table\", class:\"skin\", style:'background:#ded;')\r\n\r\n?>\r\nset(\"t2html\")\r\n\r\n\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\n\r\nformat(2)\r\njson()\r\nselect(\"$.body.*\")\r\nrun({{t2html}})\r\n"
    }
  }
}