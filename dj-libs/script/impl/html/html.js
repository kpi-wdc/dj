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
      code:   "<?javascript\r\n    \r\n    $context.rowMapper = function(d){\r\n      return \"<tr>\"+ d.value.map(function(v){\r\n         return \"<td style=\\\\\"font-size:x-small\\\\\">\"+v+\"</td>\"\r\n      }).join(\"\")+\"</tr>\"\r\n    };\r\n\r\n?>\r\n\r\n<?dps\r\n\r\n    map({{rowMapper}})\r\n    concat()\r\n    html()\r\n    wrapHtml(tag:\"table\", class:\"skin\", style:'background:#ded;')\r\n\r\n?>\r\nset(\"t2html\")\r\n\r\n\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\n\r\nformat(2)\r\njson()\r\nselect(\"$.body.*\")\r\nrun({{t2html}})\r\n"
    }
  }
}