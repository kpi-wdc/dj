var copy = require("../../../deep-copy");
var apply = copy.apply;
var util = require("util");
var jp = require("jsonpath");

var GetImplError = function(message) {
    this.message = message;
    this.name = "Command 'get' implementation error";
}
GetImplError.prototype = Object.create(Error.prototype);
GetImplError.prototype.constructor = GetImplError;


module.exports = {
    name: "get",
    synonims: {
        "get": "get"
    },

    
    "internal aliases":{
        "path": "path",
        "select": "path",
    },
    
    defaultProperty: {
        "get": "path",
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
            code:   '<% "Hello" %>\njson()\nset("str")\n'+
                    '<% var notNull = function(item){return item != undefined} %>\n'+
                    'js()\nset("functions")\n'+
                    'src(ds:"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02")\njson();'+
                    '\nselect("$.metadata.dataset.commit")\n'+
                    'set(var:"commitNote", val:"$[0].note")\nget("str")\ninfo()\n'+
                    'get("functions.notNull")\ninfo()\nget("commitNote")\ninfo()\n'+
                    '// equals for previus\nget("$.commitNote")\ninfo()\nlog()'
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

                state.head = {
                    data: copy(state.storage),
                    type: "json"
                }
                if (util.isFunction(state.head.data)) state.head.type = 'function'
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
                type: "json"
            }
            if (util.isFunction(state.head.data)) state.head.type = 'function'
                // }
            return state
        } catch (e) {
            throw new GetImplError(e.toString())
        }
    }
}
