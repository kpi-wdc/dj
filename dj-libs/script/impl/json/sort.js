var util = require("util");
var query = require("../../../query/query")

var SortImplError = function(message) {
    this.message = message;
    this.name = "Command 'sort' implementation error";
}
SortImplError.prototype = Object.create(Error.prototype);
SortImplError.prototype.constructor = SortImplError;

module.exports = {
    name: "sort",
    synonims: {},

    "internal aliases": {
        "criteria": "criteria"
    },

    defaultProperty: {
        "sort": "criteria"
    },

    execute: function(command, state, config) {
        if (state.head.type != "json") 
            throw new SortImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
        if (!util.isArray(state.head.data)) 
            throw new SortImplError("Incompatible context type: '" + (typeof state.head.data)+"'.")
        if(!command.settings.criteria) 
            throw new SortImplError("Criteria js callback not defined.")
        if(!util.isFunction(command.settings.criteria))
            throw new SortImplError("Criteria js callback shuld be a js function.")
        
        try {
            var res = new query()
                        .from(state.head.data)
                        .order(command.settings.criteria)
                        .get()
            state.head = {
                data: res,
                type: "json"
            }
        } catch (e) {
            throw new SortImplError(e.toString())
        }

        return state;
    },

    help: {
        synopsis: "Sort context items via javascript callback",

        name: {
            "default": "sort",
            synonims: []
        },
        input:["json"],
        output:"json",
        "default param": "criteria",

        params: [{
            name: "criteria",
            synopsis: "javascript callback function(a, b){< return  positive number if a>b >} via bindable (required)",
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
