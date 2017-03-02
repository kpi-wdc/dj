var Promise = require("bluebird");
var Cache = require("../Cache");
var logger = require("../../../dj-libs/log").global;
var I18N = require("../../../dj-libs/i18n");
var jp = require("jsonpath");


var CacheImplError = function(message) {
    this.message = message;
    this.name = "Command 'cache' implementation error";
}
CacheImplError.prototype = Object.create(Error.prototype);
CacheImplError.prototype.constructor = CacheImplError;



var prepareCachedResult = function(d){
  d = (util.isArray(d))? d[0] : d;
  d = d || {};
  return {
    data: d.value,
    data_id: d.id,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  }
}

var impl = function(data, params){
	return new Promise(function(resolve,reject){
		Cache
          .save("process",params.script,data,{})
          .then(function(result){
            resolve(prepareCachedResult(result))
          })
          .catch(function(e){
            reject(new CacheImplError(e.toString()))
          })
	})
}

module.exports =  {
    name: "cache",
    synonims: {
        "cache": "cache",
        "save": "cache"
    },
    
    defaultProperty: {},

    execute: function(command, state) {
        return new Promise(function(resolve, reject) {
            state.locale = (state.locale) ? state.locale : "en";
            command.settings.locale = state.locale;
            command.settings.script = state.instance.script();
            
            impl(state.head.data, command.settings)
                .then(function(result) {
                    state.head = {
                        type: "json",
                        data: result
                    }
                    resolve(state);
                })
                .catch(function(e) {
                    reject(e)
                })
        })
    },

    help: {
        synopsis: "Save context into cache",
        name: {
            "default": "cache",
            synonims: ["cache","save"]
        },
        "default param": "none",
        params: [],
        example: {
            description: "Save context into cache",
            code: "load(\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\n    as:'json'\n)\nselect('$.metadata')\nextend()\ntranslate()\ncache()\nselect(\"$.data_id\")\n"
        }

    }
} 