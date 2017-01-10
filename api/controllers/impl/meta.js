var Promise = require("bluebird");
var Cache = require("../Cache");
var logger = require("../../../dj-libs/log").global;
var I18N = require("../../../dj-libs/i18n");
var jp = require("jsonpath");

var MetaImplError = function(message) {
    this.message = message;
    this.name = "Command 'metadata' implementation error";
}
MetaImplError.prototype = Object.create(Error.prototype);
MetaImplError.prototype.constructor = MetaImplError;

var impl = function(params) {
    return new Promise(function(resolve, reject) {
        Dataset.find({ "commit/HEAD": true })
            .then(function(datasets) {
                datasets = datasets.map(function(item) {
                    return item.metadata
                })
                Dictionary.find({})
                    .then(function(json) {
                        i18n = new I18N(json);
                        Promise.reduce(datasets, function(c, dataset) {
                            return new Promise(function(resolve) {
                                dataset = i18n.translate(dataset, params.locale);
                                for (i in dataset.dimension) {
                                    dataset.dimension[i].values =
                                        i18n.translate(dataset.dimension[i].values, params.locale)
                                    dataset.dimension[i].label = i18n.translate(dataset.dimension[i].label, params.locale);
                                }
                                resolve()
                            })
                        }, 0).then(function() {
                                if (params.path) {
                                    try{
                                        var selected = jp.query(datasets, params.path) 
                                        resolve(selected)
                                    }catch (e){
                                        reject(e)
                                    }    
                                }
                            resolve(datasets)
                        })
                    })
            })
    })
}

module.exports = {
    name: "metadata",
    synonims: {
        "metadata": "metadata",
        "meta": "metadata"
    },

    "internal aliases":{
        "path":"path",
        "select":"path"
    },

    defaultProperty: {
        "metadata": "path",
        "meta": "path"
    },

    execute: function(command, state) {
        return new Promise(function(resolve, reject) {
            state.locale = (state.locale) ? state.locale : "en";
            command.settings.locale = state.locale;
            impl(command.settings)
                .then(function(result) {
                    state.head = {
                        type: "json",
                        data: result
                    }
                    resolve(state);
                })
                .catch(function(e) {
                    reject(new MetaImplError(e.toString()))
                })
        })
    },

    help: {
        synopsis: "Get metadata",
        name: {
            "default": "metadata",
            synonims: ["metadata", "meta"]
        },
        input:["any"],
        output:"json",
        "default param": "path",
        params: [{
            name: "path",
            synopsis: "Json path for content selection",
            type:["json-path"],
            synonims: [],
            "default value": "undefined"
        }],
        example: {
            description: "Get array of UUIDs for dataset that have source equils to #WB",
            code: "meta('$[?(@.dataset.source=='#WB')].dataset.id')"
        }

    }
}
