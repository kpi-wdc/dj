var Promise = require("bluebird");
var Cache = require("../Cache");
var logger = require("../../../dj-libs/log").global;
var I18N = require("../../../dj-libs/i18n");
var jp = require("jsonpath");

var TranslateImplError = function(message) {
    this.message = message;
    this.name = "Command 'translate' implementation error";
}
TranslateImplError.prototype = Object.create(Error.prototype);
TranslateImplError.prototype.constructor = TranslateImplError;


var impl = function(data, params){
	var dict = {}
	function _lookup(o){
		if(util.isObject(o)){
			for(var key in o){
				o[key] = _lookup(o[key])
			}
			return o
		}
		if(util.isArray(o)){
			return o.map(function(item){return _lookup(item)})
		}
		if(util.isString(o)){
			return (dict[o] && dict[o][params.locale])? dict[o][params.locale] : o
		}	
		return o;
	}

	return new Promise(function(resolve){
      Dictionary.find({type:"i18n"})
            .then(function(json){
              json.forEach(function(item){
              	dict[item.key] = item.value;
              })
              obj = _lookup(data);
              resolve(obj);
            })
      }) 
}

module.exports =  {
    name: "translate",
    synonims: {},
    
    defaultProperty: {},

    execute: function(command, state) {
        return new Promise(function(resolve, reject) {
            state.locale = (state.locale) ? state.locale : "en";
            command.settings.locale = state.locale;
            impl(state.head.data, command.settings)
                .then(function(result) {
                	state.head = {
                        type: "json",
                        data: result
                    }
                    resolve(state);
                })
                .catch(function(e) {
                    reject(new TranslateImplError(e.toString()))
                })
        })
    },

    help: {
        synopsis: "Translate data",
        name: {
            "default": "translate",
            synonims: []
        },
        input:["json"],
        output:"json",
        "default param": "none",
        params: [],
        example: {
            description: "Extend and translate dataset metadata",
            code: "src(ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02')\njson()\nselect('$.metadata')\nextend()\ntranslate()"
        }

    }
} 