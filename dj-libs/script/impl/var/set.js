var copy = require("../../../deep-copy");
var apply = copy.apply;
var util = require("util");
var jp = require("jsonpath");


var SetImplError = function(message) {
    this.message = message;
    this.name = "Command 'set' implementation error";
}
SetImplError.prototype = Object.create(Error.prototype);
SetImplError.prototype.constructor = SetImplError;

module.exports = {
    name: "set",
    synonims: {
        "set": "set",
        "put": "set",
        "let": "set"
    },
    "internal aliases":{
        "var": "var",
        "variable":"var",
        "value":"value",
        "val":"value"
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
            synonims: ["set","put","let"]
        },
        input:["any"],
        output:"type of input context",
        "default param": "var",
        params: [
            {
                name: "var",
                synopsis: "Variable name (required).",
                type:["string"],
                synonims: ["var","variable"],
                "default value": "undefined"
            },
            {
                name: "value",
                synopsis: "Json path to selected value (optional). If 'value' is not assigned then input context will be stored.",
                type:["json-path"],
                synonims: ["value","val"],
                "default value": "'$'"
            }
        ],
        example: {
            description: "Variable usage",
            code: '<% "Hello" %>\njson()\nset("str")\n<% var notNull = function(item){return item != undefined} %>\njs()\nset("functions")\nsrc(ds:"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02")\njson();\nselect("$.metadata.dataset.commit")\nset(var:"commitNote", val:"$[0].note")\nget()'
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

            if (command.settings.var) {
                if (util.isUndefined(command.settings.value) || command.settings.value == "" || command.settings.value == "$") {
                    // if (state.head.type == 'function') {
                    //     state.storage._ = (state.storage._)? state.storage._ : {};
                    //     state.storage._[command.settings.var] = state.head.data
                    //     return state;
                    // }
                    state.storage = apply(state.storage, { path: command.settings.var, value: copy(state.head.data) })
                        // scriptContext[params.var] = copyObject(data);
                    return state;
                } else {

                    if (util.isFunction(command.settings.value) || util.isPrimitive(command.settings.value)) {
                        state.storage = apply(state.storage, { path: command.settings.var, value: copy(getProperty(state.head.data, command.settings.value)) })
                            // scriptContext[params.var] = copyObject(getProperty(data,params.value));
                        return state;
                    }
                    if (util.isArray(command.settings.value)) {
                        state.storage = apply(state.storage, { path: command.settings.var, value: [] })
                            // scriptContext[params.var] = [];
                        command.settings.value.forEach(function(item, index) {
                            state.storage = apply(state.storage, { path: command.settings.var+"[" + index + "]", value: copy(getProperty(state.head.data, item)) })
                                // scriptContext[params.var].push(copyObject(getProperty(data,item)))
                        })
                        return state;
                    }
                    if (util.isObject(params.value)) {
                        state.storage = apply(state.storage, { path: command.settings.var, value: {} })
                            //scriptContext[params.var] = {};
                        for (var key in command.settings.value) {
                            state.storage = apply(state.storage, { path: command.settings.var+"." + key, value: copy(getProperty(state.head.data, command.settings.value[key])) })
                                // scriptContext[params.var][key] = copyObject(getProperty(data,params.value[key]))
                        }
                        return state;
                    }

                }
            } else {
                throw new SetImplError("Variable is not defined.")
            }
        } catch (e) {
            throw new SetImplError(e.toString())
        }
    }
}
