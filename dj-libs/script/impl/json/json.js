var util = require("util");
var iconv = require('iconv-lite');
var csvjson = require("csvjson");
var xmljson = require("xml2js");
var htmljson = require('html2json').html2json;
var Promise = require('bluebird');

var JsonImplError = function(message) {
    this.message = message;
    this.name = "Command 'json' implementation error";
}
JsonImplError.prototype = Object.create(Error.prototype);
JsonImplError.prototype.constructor = JsonImplError;

var implementation = function(command, state) {
    try {

      if(state.head.type == "csv"){
        var options = {
          delimiter: command.settings.delimiter || ";",
          quote: command.settings.quote || null
        }
        
        command.settings.encode = command.settings.encode || "utf8";
        state.head.data = iconv.encode(
            new Buffer(state.head.data),command.settings.encode
           ).toString().trim();
        state.head.data = csvjson.toObject(state.head.data, options);
        state.head.type = "json"
        return state;
      }


      if(state.head.type == "xml"){
        return new Promise(function(resolve,reject){
          var parser = new xmljson.Parser({
            attrkey: "_attributes",
            charkey: "_text"

          });
          parser.parseString(state.head.data, function(error,result){
            if (error) reject(new JsonImplError(error.toString()))
             state.head = {
              data: result,
              type: "json"
            }
            resolve(state)  
          })
        })
      }

      if(state.head.type == "html"){
          
         state.head = {
              data: htmljson(state.head.data.replace(/<!DOCTYPE[\w\s\.]*>/g,"")),
              type: "json"
            }
        return state    
      }  


        state.head = {
            data: (util.isString(state.head.data)) ? JSON.parse(state.head.data) : JSON.parse(JSON.stringify(state.head.data)),
            type: "json"
        }
        return state;
    } catch (e) {
        throw new JsonImplError(e.toString())
    }
}

module.exports = {
    name: "json",
    synonims: {
        "json": "json",
        "JSON": "json"
    },
   
    "internal aliases":{
        "delimiter": "delimiter",
        "quote": "quote",
        "encode":"encode",
        "encoding":"encode"
    },
    
   
    defaultProperty: {},
    implementation: implementation,

    execute: function(command, state, config) {
        return implementation(command,state)
    },

    help: {
        synopsis: "Convert script context to json object",

        name: {
            "default": "json",
            synonims: ["json", "JSON"]
        },
        input: ["any"],
        output: "json",
        "default param": "none",

        params: [{
            name: "delimiter",
            synopsis: "Code separator",
            type:["bindable"],
            synonims: [],
            "default value": 0
        },{
            name: "quote",
            synopsis: "Quote in code",
            type:["bindable"],
            synonims: [],
            "default value": 0
        },{
            name: "encode",
            synopsis: "Encoding of programs",
            type:["bindable"],
            synonims: ["encode", "encoding"],
            "default value": 2
        }],

        example: {
            description: "Convert string value '[1,1,1]' to array of numbers",
            code: "<?json\r\n    [1,1,1]\r\n?>\r\nset('json')\r\n\r\n<?csv\r\n    a;b;c\r\n    1;2;3\r\n    4;5;6\r\n?>\r\njson()\r\nset('csv')\r\n\r\n<?xml\r\n    <a id=\"1\">\r\n        <b><![CDATA[<no parsed data> ]]> text value 0</b>\r\n        <b><![CDATA[<no parsed data> ]]> text value 1</b>\r\n        \r\n    </a>\r\n?>\r\njson()\r\nset('xml')\r\n\r\n<?html\r\n    <div id=\"1\">\r\n        <h2>Title</h2>\r\n        <div>Content</div>\r\n    </div>\r\n?>\r\njson()\r\nset('html')\r\n\r\nget()\r\n"
        }
    }
}
