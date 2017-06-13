var Promise = require("bluebird");
var http = require('request-promise');
var set = require("../var/set").implementation;
var jp = require("jsonpath");
var util = require("util");

var ImportImplError = function(message) {
    this.message = message;
    this.name = "Command 'import' implementation error";
}
ImportImplError.prototype = Object.create(Error.prototype);
ImportImplError.prototype.constructor = ImportImplError;

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
                reject(new ImportImplError(e.toString()))
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
    name: "import",
    synonims: {
        "import": "import"
    },


    "internal aliases": {
        "path": "path",
        "extension": "path",
        "ext": "path",
        "var": "var",
        "into": "var"
    },

    defaultProperty: {
        "import": "path"
    },

    execute: function(command, state) {
    	
    	if (!state._lib)
            throw new ImportImplError("Library not defined")
        if (!command.settings.path)
            throw new ImportImplError("Cannot import undefined extension")
        
        command.settings.var = (command.settings.var) ? command.settings.var : "_extensions."+command.settings.path;

        var extention = getProperty(state._lib, command.settings.path);
        if(!extention) 
            throw new ImportImplError("Extension "+command.settings.path+" not found")
        
        var url = extention["import"];

        if(!url)
            throw new ImportImplError("Extension "+command.settings.path+"cannot not be imported")
        
        return new Promise(function(resolve, reject) {
            getUrl(url)
                .then(function(result) {
                    
                    state.head = {
                        data: result,
                        type: "dps"
                    }

                    resolve( set(command.settings.var, '', state));
                })
                .catch(function(error) {
                    reject(new ImportImplError(error.toString()))
                })
        })
    },

    help: {
        synopsis: "Importing functions, objects, or primitives.",
        name: {
            "default": "import",
            synonims: []
        },
        input: ["any"],
        output: "type of variable",
        "default param": "path",
        params: [{
            name: "path",
            synopsis: "Json path to selected value (optional). If 'value' is not assigned then storage will be restored.",
            type: ["json-path"],
            synonims: ["path", "extension", "ext"],
            "default value": "$"
        },{
            name: "var",
            synopsis: "Json var to selected value (optional). If 'value' is not assigned then storage will be restored.",
            type: ["json-path"],
            synonims: ["into"],
            "default value": "$"
        }],
        example: {
            description: "Inspect variables",
            code: "<?json \r\n    \"Hello\" \r\n?>\r\nset(\"str\")\r\n\r\n<?javascript \r\n    var notNull = function(item){\r\n        return item != undefined\r\n        \r\n    }; \r\n?>\r\nset(\"functions\")\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\", \r\n    as:'json'\r\n)\r\n\r\nselect(\"$.metadata.dataset.commit\")\r\n\r\nset(var:\"commitNote\", val:\"$[0].note\")\r\nget(\"str\")\r\ninfo()\r\nget(\"functions.notNull\")\r\ninfo()\r\nget(\"commitNote\")\r\ninfo()\r\n// equals for previus\r\nget(\"$.commitNote\")\r\ninfo()\r\nlog()\r\n"

        }

    }
}
