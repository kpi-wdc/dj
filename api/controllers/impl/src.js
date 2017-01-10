var Promise = require("bluebird");
var Cache = require("../Cache");
var logger = require("../../../dj-libs/log").global;
var I18N = require("../../../dj-libs/i18n");
var jp = require("jsonpath");
var http = require('request-promise');

var SourceImplError = function(message) {
    this.message = message;
    this.name = "Command 'source' implementation error";
}
SourceImplError.prototype = Object.create(Error.prototype);
SourceImplError.prototype.constructor = SourceImplError;




var getDataset = function (id,locale){
	return new Promise(function(resolve,reject){
		Dataset.findOne({"dataset/id": id, "commit/HEAD": true})
       	.then(function(dataset){
            if(!dataset){
                reject(new SourceImplError("Dataset not found"))
            }
       		Dictionary.find({})
	          .then(function(json){
	            i18n = new I18N(json);
	            dataset.data = i18n.translate(dataset.data,locale);
	            dataset.metadata = i18n.translate(dataset.metadata,locale);
	          
	            for(i in dataset.metadata.dimension){
	              dataset.metadata.dimension[i].values = 
	              i18n.translate(dataset.metadata.dimension[i].values,locale)  
	              dataset.metadata.dimension[i].label = i18n.translate(dataset.metadata.dimension[i].label,locale);
	            } 
	        	resolve(dataset)    
	          })
              .catch(function(e){reject(new SourceImplError(e.toString()))})
       	})
        .catch(function(e){
            reject(new SourceImplError(e.toString()))
        })	
	})
}

var getCache = function (id){
	return new Promise(function(resolve,reject){
		Cache
        	.getById(id)
        	.then(function(cached){
    	  		resolve(cached.value)
          	})	
	})
}

var getUrl = function (url){
    return new Promise(function(resolve,reject){
        var options = {
            // localAddress: url,
            uri: url,
            method:"get"
        }
        http(options)
            .then(function(result){
                resolve(result)
            })
            .catch(function(e){
                reject(new SourceImplError(e.toString()))
            })
    })
}


var impl = function(params){
	if(params.dataset){
		return getDataset(params.dataset, params.locale)	
	}
	
	if(params.cache){
		return getCache(params.cache)
	}

    if(params.url){
        return getUrl(params.url)
    }

	throw new SourceImplError("Data not found");
}

module.exports = {
    name: "source",
    
    synonims: {
        "source": "source",
        "src": "source"
    },
    
    "internal aliases":{
        "dataset":"dataset",
        "ds":"dataset",
        "cache":"cache",
        "url": "url",
        "uri": "url",
        "ref": "url"
    },

    defaultProperty: {},

    execute: function(command, state) {
        return new Promise(function(resolve, reject) {
            state.locale = (state.locale) ? state.locale : "en";
            command.settings.locale = state.locale;
            impl(command.settings)
                .then(function(result) {
                	state.head = {
                        type: typeof result,
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
        synopsis: "Get data from source. Available sources: dataset, cached data, external url",
        name: {
            "default": "source",
            synonims: ["source", "src"]
        },
        "default param": "None. Shuld be assigned one from: 'dataset', 'cache', 'url'",
        
        input:["any"],
        output:"type of fetched data",

        params: [{
            name: "dataset",
            synopsis: "UUID for dataset (optional). Use command 'meta()' for find datasets.",
            type:["dataset UUID"],
            synonims: ["dataset","ds"],
            "default value": "undefined"
        },{
            name: "cache",
            synopsis: "UUID for cached data (optional). Use command 'cache()' for cache context. ",
            type:["cached data UUID"],
            synonims: [],
            "default value": "undefined"
        },
        {
            name: "url",
            synopsis: "Url for data (optional). You can process external data via url.",
            type:["url"],
            synonims: ["url","uri","ref"],
            "default value": "undefined"
        }],
        example: {
            description: "Get data from various sources",
            code: "src(ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02')\ninfo()\nsrc(cache:'5855481930d9ae60277a474a')\ninfo()\nsrc(url:'http://127.0.0.1:8088/api/data/process/5855481930d9ae60277a474a')\ninfo()\nlog()"
        }

    }
} 