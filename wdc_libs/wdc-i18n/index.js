var query = require("wdc-query");
util = require("util");


I18N = function(dictionary){
	this.translations = {}
	this._key = [];
	this._result = [];
	thos = this;
	new query()
		.from(dictionary)
		.select(function(item){return item.type == "i18n"})
		.get()
		.forEach(function(item){
			thos.translations[item.key] = item.value;
		});
	console.log(this.translations)	
}

I18N.prototype = {
	setDefault : function(lang){
		this.lang = lang;
	},

	translate : function(o, lang){
		lang = lang || this.lang;
		
		if(util.isString(o)){
			return (this.translations[o]) ? this.translations[o][lang]: o;
		}

		if(util.isArray(o) || util.isObject(o)){
			result = (util.isArray(o)) ? [] : {}; 
			for(key in o){
				this._key.push(key);
				this._result.push(result);
				tro = this.translate(o[key],lang);
				key = this._key.pop();
				result = this._result.pop();
				result[key] = tro;
			}
			return result;
		}

		return o;
	}
}

module.exports = I18N;