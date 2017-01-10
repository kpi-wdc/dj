var Promise = require("bluebird");
var parser = require("./parser");
var jp = require("jsonpath");
var copy = require('../deep-copy');
var logger = require("../log").global;
var util = require("util");

var ScriptError = function(message) {
    this.message = message;
    this.name = "ScriptError";
}
ScriptError.prototype = Object.create(Error.prototype);
ScriptError.prototype.constructor = ScriptError;

var Script = function(config, script, context) {

    this._script = script;

    this._config = config || [];

    this._state = {
        locale: "en",
        instance: this,
        storage: context || {},
        head: {
            type: undefined,
            data: undefined
        }
    }
}


Script.prototype.errorState = function(msg) {
    this._state.head = {
        type: "error",
        data: msg.toString()
    }
    delete this._state.instance;
    return this._state;
}

Script.prototype.execute = function(command, state, config) {

    var getProperty = function(d, path) {
        try{
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
    } catch (e){
        // console.log(e.toString())
        return undefined
    }
    }

    var applyContext = function(o, c) {

        if (util.isObject(o)) {
            for (var key in o) {
                o[key] = applyContext(o[key], c)
            }
            return o
        }
        if (util.isArray(o)) {
            return o.map(function(item) {
                return applyContext(item, c)
            })
        }
        if (util.isString(o)) {
            if (o.match(/\{\{[\s\S]*\}\}/gi)) {
                var key = o.substring(2, o.length - 2);
                var r = getProperty(c, key);
                return (r) ? copy(r) : o
            } else {
                return o
            }
        }
        return o;
    }

    var self = this;

    return new Promise(function(resolve, reject) {

        var executor = self._config.map(function(item) {
            return item.name
        }).indexOf(command.processId);
        executor = self._config[executor]
        if (!executor || !executor.execute) {
            reject(new ScriptError("Command '" + command.processId + "'  not implemented"))
            return
        }
        try {
            // if (command.processId != "context") {
                command = applyContext(command, self._state.storage)
            // }
                var s = executor.execute(command, self._state, config)
            if (s.then) {
                s
                    .then(function(state) {
                        resolve(state)
                    })
                    .catch(function(e) {
                        reject(e)
                    })

            } else {
                resolve(s)
            }
        } catch (e) { 
            reject(e) 
        }
    })
}

Script.prototype.run = function(state) {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (!self._script) {
            reject(new ScriptError("Cannot run undefined script"))
        }
        if (self._config.length == 0) {
           reject(new ScriptError("Interpretator not configured"))
        }
        if (state) {
            self._state.locale = state.locale || self._state.locale;
            self._state.storage = state.storage || self._state.storage;
        }


        try {
            var commandList = new parser()
                .config(self._config)
                .parse(self._script);
        } catch (e) {
            reject(e)
        }


        Promise
            .reduce(commandList, function(cp, command, index) {
                return new Promise(function(resolve, reject) {
                    self.execute(command, self._state, self._config)
                        .then(function(newState) {
                            self._state = newState
                            resolve(self._state)
                        })
                        .catch(function(e) {
                            reject(e)
                        })
                })

            }, 0)
            .then(function() {
                resolve(self._state.head)
            })
            .catch(function(e) {
                reject(e)
            })
    })

}

Script.prototype.script = function() {
    if (arguments.length > 0) {
        this._script = arguments[0];
        return this;
    }
    return this._script;
}

Script.prototype.state = function() {
    if (arguments.length > 0) {
        this._state = arguments[0];
        return this;
    }
    return this._state;
}

Script.prototype.config = function() {
    if (arguments.length > 0) {
        this._config = arguments[0];
        return this;
    }
    return this._config;
}

module.exports = Script;
