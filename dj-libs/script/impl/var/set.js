var copy = require("../../../deep-copy");
var apply = copy.apply;
var util = require("util");
var jp = require("jsonpath");
var Promise =require('bluebird');


var SetImplError = function(message) {
    this.message = message;
    this.name = "Command 'set' implementation error";
}
SetImplError.prototype = Object.create(Error.prototype);
SetImplError.prototype.constructor = SetImplError;

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

var implementation = function(_var, value, state) {
    if (util.isUndefined(value) || value == "" || value == "$") {
        state.storage = apply(state.storage, {
            path: _var,
            value: (state.head.data instanceof Promise) ? state.head.data : copy(state.head.data)
        })
        return state;
    } else {
        if (value instanceof Promise) {
            state.storage = apply(state.storage, {
                path: _var,
                value: state.head.data
            })
            return state;
        }
        if (util.isFunction(value) || util.isPrimitive(value)) {
            state.storage = apply(state.storage, {
                path: _var,
                value: copy(getProperty(state.head.data, value))
            })
            return state;
        }
        if (util.isArray(value)) {
            state.storage = apply(state.storage, {
                path: _var,
                value: []
            })
            value.forEach(function(item, index) {
                state.storage = apply(state.storage, {
                    path: _var + "[" + index + "]",
                    value: copy(getProperty(state.head.data, item))
                })
            })
            return state;
        }
        if (util.isObject(value)) {
            state.storage = apply(state.storage, {
                path: _var,
                value: {}
            })
            for (var key in value) {
                state.storage = apply(state.storage, {
                    path: _var + "." + key,
                    value: copy(getProperty(state.head.data, value[key]))
                })
            }
            return state;
        }
    }
}

module.exports = {
    name: "set",
    synonims: {
        "set": "set",
        "put": "set",
        "let": "set"
    },
    "internal aliases": {
        "var": "var",
        "variable": "var",
        "value": "value",
        "val": "value"
    },
    defaultProperty: {
        "set": "var",
        "put": "var",
        "let": "var"
    },

    help: {
        synopsis: "Set variable value",
        name: {
            "default": "set",
            synonims: ["set", "put", "let"]
        },
        input: ["any"],
        output: "type of input context",
        "default param": "var",
        params: [{
            name: "var",
            synopsis: "Variable name (required).",
            type: ["string"],
            synonims: ["var", "variable"],
            "default value": "undefined"
        }, {
            name: "value",
            synopsis: "Json path to selected value (optional). If 'value' is not assigned then input context will be stored.",
            type: ["json-path"],
            synonims: ["value", "val"],
            "default value": "'$'"
        }],
        example: {
            description: "Variable usage",
            code: "<?json \r\n    \"Hello\" \r\n?>\r\nset(\"str\")\r\n\r\n<?javascript \r\n    var notNull = function(item){\r\n        return item != undefined\r\n        \r\n    }; \r\n?>\r\nset(\"functions\")\r\n\r\nload(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\", \r\n    as:'json'\r\n)\r\n\r\nselect(\"$.metadata.dataset.commit\")\r\n\r\nset(var:\"commitNote\", val:\"$[0].note\")\r\nget(\"str\")\r\ninfo()\r\nget(\"functions.notNull\")\r\ninfo()\r\nget(\"commitNote\")\r\ninfo()\r\n// equals for previus\r\nget(\"$.commitNote\")\r\ninfo()\r\nlog()\r\n"
        }

    },

    implementation: implementation, 

    execute: function(command, state) {
        try {
            // var getProperty = function(d, path) {
            //     var result = undefined;
            //     jp.apply(d, path, function(value) {
            //         if (util.isUndefined(result)) {
            //             result = value;
            //         } else {
            //             if (!util.isArray(result)) {
            //                 result = [result]
            //             }
            //             result.push(value)
            //         }
            //         return value
            //     })
            //     return result
            // }

            if (command.settings.var) {
                return(implementation(command.settings.var,command.settings.value,state))
                // if (util.isUndefined(command.settings.value) || command.settings.value == "" || command.settings.value == "$") {
                //     // if (state.head.type == 'function') {
                //     //     state.storage._ = (state.storage._)? state.storage._ : {};
                //     //     state.storage._[command.settings.var] = state.head.data
                //     //     return state;
                //     // }
                //     state.storage = apply(state.storage, { path: command.settings.var, value: copy(state.head.data) })
                //         // scriptContext[params.var] = copyObject(data);
                //     return state;
                // } else {

                //     if (util.isFunction(command.settings.value) || util.isPrimitive(command.settings.value)) {
                //         state.storage = apply(state.storage, { path: command.settings.var, value: copy(getProperty(state.head.data, command.settings.value)) })
                //             // scriptContext[params.var] = copyObject(getProperty(data,params.value));
                //         return state;
                //     }
                //     if (util.isArray(command.settings.value)) {
                //         state.storage = apply(state.storage, { path: command.settings.var, value: [] })
                //             // scriptContext[params.var] = [];
                //         command.settings.value.forEach(function(item, index) {
                //             state.storage = apply(state.storage, { path: command.settings.var+"[" + index + "]", value: copy(getProperty(state.head.data, item)) })
                //                 // scriptContext[params.var].push(copyObject(getProperty(data,item)))
                //         })
                //         return state;
                //     }
                //     if (util.isObject(params.value)) {
                //         state.storage = apply(state.storage, { path: command.settings.var, value: {} })
                //             //scriptContext[params.var] = {};
                //         for (var key in command.settings.value) {
                //             state.storage = apply(state.storage, { path: command.settings.var+"." + key, value: copy(getProperty(state.head.data, command.settings.value[key])) })
                //                 // scriptContext[params.var][key] = copyObject(getProperty(data,params.value[key]))
                //         }
                //         return state;
                //     }

                // }
            } else {
                throw new SetImplError("Variable is not defined.")
            }
        } catch (e) {
            throw new SetImplError(e.toString())
        }
    }
}
