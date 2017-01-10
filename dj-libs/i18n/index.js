var query = require("../query/query");
util = require("util");


I18N = function(dictionary){
	this.lang = "en";
	this.translations = {};
	this.lookup = {};
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

	new query()
		.from(dictionary)
		.select(function(item){return item.type != "i18n"})
		.get()
		.forEach(function(item){
			thos.lookup[item.key] = item.value;
		});	
	// console.log(this.translations)
	// console.log(this.lookup)	
}

I18N.prototype = {
	setDefault : function(lang){
		this.lang = lang;
	},

	translate : function(o, lang){
		lang = lang || this.lang || "en";
		
		if (util.isDate(o)){
			return o;
		}

		if(util.isString(o)){
			var key = (this.lookup[o] && this.lookup[o].label) ? this.lookup[o].label : o;
			if(this.translations[key]){
				if(this.translations[key][lang]){
					return this.translations[key][lang]
				}
				if(this.translations[key][this.lang]){
					return this.translations[key][this.lang]
				}
				return key; 
			}else{
				return key;
			}

			return (this.translations[key]) ? this.translations[key][lang]: key;
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