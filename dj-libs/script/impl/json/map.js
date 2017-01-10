var util = require("util");
var query = require("../../../query/query")

var MapImplError = function(message) {
    this.message = message;
    this.name = "Command 'map' implementation error";
}
MapImplError.prototype = Object.create(Error.prototype);
MapImplError.prototype.constructor = MapImplError;

module.exports = {
    name: "map",
    synonims: {},

    "internal aliases": {
        "transform": "transform"
    },

    defaultProperty: {
        "map": "transform"
    },

    execute: function(command, state, config) {
        if (state.head.type != "json") 
            throw new MapImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
        if (!util.isArray(state.head.data)) 
            throw new MapImplError("Incompatible context type: '" + (typeof state.head.data)+"'.")
        if(!command.settings.transform) 
            throw new MapImplError("Transform js callback not defined.")
        if(!util.isFunction(command.settings.transform))
            throw new GroupImplError("Transform js callback shuld be a js function.")

        try {
            var res = new query()
                        .from(state.head.data)
                        .map(command.settings.transform)
                        .get()
            state.head = {
                data: res,
                type: "json"
            }
        } catch (e) {
            throw new MapImplError(e.toString())
        }

        return state;
    },

    help: {
        synopsis: "Map context items via javascript callback",

        name: {
            "default": "map",
            synonims: []
        },
        input:["json"],
        output:"json",
        "default param": "transform",

        params: [{
            name: "transform",
            synopsis: "javascript callback function(item, index){<return new item>} via bindable (required)",
            type:["bindable"],
            synonims: [],
            "default value": "none"
        }],

        example: {
            description: "Build list of tags",
            code:   "<%\n"+
                    "   var mapper = function(d){return {key:d, value:d}}\n"+
                    "   var transform = function(d){\n"+
                    "        return {key:d.key, count: d.values.length}\n"+
                    "   }\n"+
                    "   var criteria = function(a,b){\n"+
                    "       return b.count-a.count\n"+
                    "   }\n"+
                    "%>\n"+
                    "js()\n"+
                    "set('cb')\n"+
                    "meta('$..dataset.topics.*')\n"+
                    "group('{{cb.mapper}}')\n"+
                    "map('{{cb.transform}}')\n"+
                    "sort('{{cb.criteria}}')\n"+
                    "extend()\n"+
                    "translate()\n"+
                    "log()"
        }
    }
}
