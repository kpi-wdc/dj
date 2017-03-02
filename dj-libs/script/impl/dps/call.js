var Promise = require("bluebird");
var http = require('request-promise');
var set = require("../var/set").implementation;
var jp = require("jsonpath");
var Script = require("../../index");
var copy = require("../../../deep-copy");
var util = require("util");

var CallImplError = function(message) {
    this.message = message;
    this.name = "Command 'call' implementation error";
}
CallImplError.prototype = Object.create(Error.prototype);
CallImplError.prototype.constructor = CallImplError;

var getUrl = function(url, body) {
    return new Promise(function(resolve, reject) {
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true
        }
        
        http(options)
            .then(function(result) {
                // console.log("resolve call "+ JSON.stringify(result))
                resolve(result)
            })
            .catch(function(e) {
                reject(new CallImplError(url+" > "+e.toString()))
            })
    })
}

var getProperty = function(d, path) {
    var result = undefined;
    jp.apply(d, path, function(value) {
        if (util.isUndefined(result)) {
            result = value;
        } else {
            if (!util.isArray(result)) {
                result = [result]
            }
            result.push(value)
        }
        return value
    })
    return result
}



module.exports = {
    name: "call",
    synonims: {
        "call": "call",
        "ext": "call",
        "extension": "call"
    },


    "internal aliases": {
        "path": "path",
        "extension": "path",
        "ext": "path"
    },

    defaultProperty: {
        "call": "path",
        "ext": "path",
        "extension": "path"
    },

    execute: function(command, state, config) {
    	
    	if (!state._lib)
            throw new CallImplError("Library not defined"
            	)
        if (!command.settings.path)
            throw new CallImplError("Cannot call undefined extension")
        
        
        var extention = getProperty(state._lib, command.settings.path);
        // console.log("call for "+extention.name)
        if(!extention) 
            throw new CallImplError("Extension "+command.settings.path+" not found")
        
        var url = extention.call;
        if(!url)
            throw new CallImplError("Extension "+command.settings.path+"cannot be called on server side")
            
        try{
            
            var storage = copy(state.storage);
            storage._arguments = copy(command.settings)
            
            var remoteState = {
                locale: state.locale,
                storage: storage,
                head: copy(state.head)
            }

            return getUrl(url,{state: remoteState})
                .then(function(result) {
                    state.head = result;
                    // console.log("CALL RESULT:  ", state)
                    return state;
                })
        }catch (e){
        	throw new CallImplError(e.toString())
        }
    },

    help: {
        synopsis: "Get deep copy of variable and set context",
        name: {
            "default": "get",
            synonims: []
        },
        input: ["any"],
        output: "type of variable",
        "default param": "path",
        params: [{
            name: "path",
            synopsis: "Json path to selected value (optional). If 'value' is not assigned then storage will be restored.",
            type: ["json-path"],
            synonims: ["path", "select"],
            "default value": "$"
        }],
        example: {
            description: "Inspect variables",
            code: "<?json \r\n    \"Hello\" \r\n?>\r\nset(\"str\")\r\n\r\n<?javascript \r\n    var notNull = function(item){\r\n        return item != undefined\r\n        \r\n    }; \r\n?>\r\nset(\"functions\")\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\", \r\n    as:'json'\r\n)\r\n\r\nselect(\"$.metadata.dataset.commit\")\r\n\r\nset(var:\"commitNote\", val:\"$[0].note\")\r\nget(\"str\")\r\ninfo()\r\nget(\"functions.notNull\")\r\ninfo()\r\nget(\"commitNote\")\r\ninfo()\r\n// equals for previus\r\nget(\"$.commitNote\")\r\ninfo()\r\nlog()\r\n"

        }

    }
}
