var Promise = require("bluebird");
var http = require('request-promise');
var jp = require("jsonpath");
var _ = require("lodash-node")

var LibImplError = function(message) {
    this.message = message;
    this.name = "Command 'lib' implementation error";
}
LibImplError.prototype = Object.create(Error.prototype);
LibImplError.prototype.constructor = LibImplError;

var getUrl = function(url) {
    return new Promise(function(resolve, reject) {
        var options = {
            // localAddress: url,
            uri: url,
            method: "get"
        }
        http(options)
            .then(function(result) {
                resolve(result)
            })
            .catch(function(e) {
                reject(new LibImplError(e.toString()))
            })
    })
}

var apply = function(lib, baseUrl){
    jp.apply(lib, "$..[?(@.import && @.type == 'extension')]", function(item) {
        item["import"] = baseUrl["import"] + item["import"];
        return item
    });    
    jp.apply(lib, "$..[?(@.call && @.type == 'extension')]", function(item) {
        item["call"] = baseUrl["call"] + item["call"];
        return item
    });    
    
    return lib;
} 

module.exports = {
    name: "library",
    synonims: {
        "library": "library",
        "lib": "library"
    },

    
    "internal aliases":{
        "url": "url",
        "uri":"url",
        "ref": "url",
        "into": "alias",
        "as": "alias",
        "alias":"alias"

    },
    
    defaultProperty: {
    	"library": "url",
        "lib": "url"
    },
    
    execute: function(command, state){
    	if (!command.settings.url)
            throw new LibImplError("Library url cannot be undefined")
        var url = command.settings.url;

        return new Promise(function(resolve,reject){
        	getUrl(url)
        		.then(function(result){
        			result = JSON.parse(result)
                    state._lib = (state._lib) ? state._lib:{};
                    var alias = command.settings.alias || "imports";
        			state._lib[alias] = (state._lib[alias])
                        ? _.assign(state._lib[alias], apply(result, result.baseUrl))
                        : apply(result, result.baseUrl);
                    // state._lib[alias].url = command.settings.url;

        			state.head = {
        				data: result,
        				type: "json"
        			}
                    
        			resolve(state);
        		})
        		.catch(function(error){
        			reject (new LibImplError(error.toString()))
        		})
        })
    },

    help: {
        synopsis: "Connection and work with a library",
        name: {
            "default": "library",
            synonims: ["library", "lib"]
        },
        input:["any"],
        output:"type of variable",
        "default param": "url",
        params: [
            {
                name: "url",
                synopsis: "Single resource index.",
                type:["json-path"],
                synonims: ["uri","ref"],
                "default value": "$"
            },{
                name: "alias",
                synopsis: "Additional domain name of the same site.",
                type:["json-path"],
                synonims: ["into","as"],
                "default value": "$"
            }
        ],
        example: {
            description: "Inspect variables",
            code:  "<?json \r\n    \"Hello\" \r\n?>\r\nset(\"str\")\r\n\r\n<?javascript \r\n    var notNull = function(item){\r\n        return item != undefined\r\n        \r\n    }; \r\n?>\r\nset(\"functions\")\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\", \r\n    as:'json'\r\n)\r\n\r\nselect(\"$.metadata.dataset.commit\")\r\n\r\nset(var:\"commitNote\", val:\"$[0].note\")\r\nget(\"str\")\r\ninfo()\r\nget(\"functions.notNull\")\r\ninfo()\r\nget(\"commitNote\")\r\ninfo()\r\n// equals for previus\r\nget(\"$.commitNote\")\r\ninfo()\r\nlog()\r\n"

        }

    }
}    