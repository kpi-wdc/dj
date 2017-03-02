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
            code:   "<?javascript\r\n   \r\n   $context.mapper = function(d){\r\n       return {\r\n           key:d, \r\n           value:d\r\n           \r\n       }\r\n   };\r\n   \r\n   $context.transform = function(d){\r\n        return {\r\n            key:d.key, \r\n            count: d.values.length\r\n        }\r\n   };\r\n   \r\n   $context.criteria = function(a,b){\r\n       return b.count-a.count\r\n   };\r\n   \r\n?>\r\n\r\nmeta('$..dataset.topics.*')\r\n\r\ngroup({{mapper}})\r\nmap({{transform}})\r\nsort({{criteria}})\r\n\r\nextend()\r\ntranslate()\r\n"

        }
    }
}
