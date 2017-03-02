var util = require("util");
var query = require("../../../query/query")

var GroupImplError = function(message) {
    this.message = message;
    this.name = "Command 'group' implementation error";
}
GroupImplError.prototype = Object.create(Error.prototype);
GroupImplError.prototype.constructor = GroupImplError;

module.exports = {
    name: "group",
    synonims: {},

    "internal aliases": {
        "mapper": "mapper"
    },

    defaultProperty: {
        "group": "mapper"
    },

    execute: function(command, state, config) {
        if (state.head.type != "json") 
            throw new GroupImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
        if (!util.isArray(state.head.data)) 
            throw new GroupImplError("Incompatible context type: '" + (typeof state.head.data)+".")
        if(!command.settings.mapper) 
            throw new GroupImplError("Mapper js callback not defined.")
        if(!util.isFunction(command.settings.mapper))
            throw new GroupImplError("Mapper js callback shuld be a js function.")
        
        try {
            var res = new query()
                        .from(state.head.data)
                        .group(command.settings.mapper)
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
        synopsis: "Build groups from context via javascript callback",

        name: {
            "default": "group",
            synonims: []
        },
        input:["json"],
        output:"json",
        "default param": "mapper",

        params: [{
            name: "transform",
            synopsis: "javascript callback function(item){<return {key, value}>} via bindable (required)",
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
