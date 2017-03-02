var Promise = require("bluebird");
var Cache = require("../Cache");
var logger = require("../../../dj-libs/log").global;
var I18N = require("../../../dj-libs/i18n");
var jp = require("jsonpath");


var LookupImplError = function(message) {
    this.message = message;
    this.name = "Command 'lookup' implementation error";
}
LookupImplError.prototype = Object.create(Error.prototype);
LookupImplError.prototype.constructor = LookupImplError;


var impl = function(data) {

    var dict = {}

    function _lookup(o) {
        if (util.isObject(o)) {
            for (var key in o) {
                o[key] = _lookup(o[key])
            }
            return o
        }
        if (util.isArray(o)) {
            return o.map(function(item) {
                return _lookup(item) })
        }
        if (util.isString(o)) {
            return (dict[o]) ? dict[o] : o
        }
        return o;
    }


    return new Promise(function(resolve) {
        Dictionary.find({})
            .then(function(json) {
                json
                    .filter(function(item) {
                        return item.type != "i18n"
                    })
                    .forEach(function(item) {
                        dict[item.key] = item.value;
                    })
                var res = _lookup(data)
                resolve(res);
            })
    })
}

module.exports = {
    name: "lookup",
    synonims: {
        "lookup": "lookup",
        "extend": "lookup"
    },

    defaultProperty: {},

    execute: function(command, state) {
        return new Promise(function(resolve, reject) {
            state.locale = (state.locale) ? state.locale : "en";
            command.settings.locale = state.locale;
            impl(state.head.data)
                .then(function(result) {
                    state.head = {
                        type: "json",
                        data: result
                    }
                    resolve(state);
                })
                .catch(function(e) {
                    reject(new LookupImplError(e.toString()))
                })
        })
    },

    help: {
        synopsis: "Extends metadata from dictionary",
        name: {
            "default": "lookup",
            synonims: ["lookup", "extend"]
        },
        input:["json"],
        output:"json",
        "default param": "none",
        params: [],
        example: {
            description: "Extend and translate dataset metadata",
            code: "load(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:'json'\r\n)\r\nselect('$.metadata')\r\nextend()\r\ntranslate()\r\n\r\n"
        }
    }
}
