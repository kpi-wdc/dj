var copy = require("../../../deep-copy");
var apply = copy.apply;
var util = require("util");
var jp = require("jsonpath");

var ReturnImplError = function(message) {
    this.message = message;
    this.name = "Command 'return' implementation error";
}
ReturnImplError.prototype = Object.create(Error.prototype);
ReturnImplError.prototype.constructor = ReturnImplError;


module.exports = {
    name: "return",
    synonims: {
        "return": "return"
    },

    
    "internal aliases":{
        "path": "path",
        "var":"path",
        "as": "as",
        "type":"as"
    },
    
    defaultProperty: {
        "return": "path",
    },

    help: {
        synopsis: "Get deep copy of variable and set context",
        name: {
            "default": "get",
            synonims: []
        },
        input:["any"],
        output:"type of variable",
        "default param": "path",
        params: [
            {
                name: "path",
                synopsis: "Json path to selected value (optional). If 'value' is not assigned then storage will be restored.",
                type:["json-path"],
                synonims: ["path","select"],
                "default value": "$"
            }
        ],
        example: {
            description: "Inspect variables",
            code:  "<?json \r\n    \"Hello\" \r\n?>\r\nset(\"str\")\r\n\r\n<?javascript \r\n    var notNull = function(item){\r\n        return item != undefined\r\n        \r\n    }; \r\n?>\r\nset(\"functions\")\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\", \r\n    as:'json'\r\n)\r\n\r\nselect(\"$.metadata.dataset.commit\")\r\n\r\nset(var:\"commitNote\", val:\"$[0].note\")\r\nget(\"str\")\r\ninfo()\r\nget(\"functions.notNull\")\r\ninfo()\r\nget(\"commitNote\")\r\ninfo()\r\n// equals for previus\r\nget(\"$.commitNote\")\r\ninfo()\r\nlog()\r\n"

        }

    },


    execute: function(command, state) {
        try {
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

            if (util.isUndefined(command.settings) || util.isUndefined(command.settings.path) || command.settings.path == "" || command.settings.path == "$") {

                // state.head = {
                //     data: state.head.data,
                //     type: command.settings.as || "json"
                // }
                // if (util.isFunction(state.head.data)) state.head.type = 'function'
                return state;
            }
            // if (command.settings.path.indexOf("_")==0){
            //    var res = state.storage._[command.settings.path.substring(2,command.settings.path.length)];
            //    state.head={
            //     data: res,
            //     type: typeof res
            //   }
            // }else{
            state.head = {
                data: copy(getProperty(state.storage, command.settings.path)),
                type: command.settings.as || "json"
            }
            if (util.isFunction(state.head.data)) state.head.type = 'function'
                // }
            return state
        } catch (e) {
            throw new ReturnImplError(e.toString())
        }
    }
}
