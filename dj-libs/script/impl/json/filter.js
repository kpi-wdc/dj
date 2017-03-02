var util = require("util");

var FilterImplError = function(message) {
    this.message = message;
    this.name = "Command 'filter' implementation error";
}
FilterImplError.prototype = Object.create(Error.prototype);
FilterImplError.prototype.constructor = FilterImplError;

module.exports = {
    name: "filter",
    synonims: {
        "filter": "filter"
    },

    "internal aliases": {
        "criteria": "criteria",
        "select": "criteria",
    },

    defaultProperty: {
        "filter": "criteria"
    },

    execute: function(command, state, config) {
        try {
            var res = state.head.data.filter(command.settings.criteria)
            state.head = {
                data: res,
                type: "json"
            }
        } catch (e) {
            throw new FilterImplError(e.toString())
        }

        return state;
    },

    help: {
        synopsis: "Filter context via javascript context",

        name: {
            "default": "filter",
            synonims: []
        },
        input:["json"],
        output:"json",
        "default param": "criteria",

        params: [{
            name: "criteria",
            synopsis: "javascript callback via bindable (required)",
            type:["bindable"],
            synonims: ["criteria", "select"],
            "default value": "none"
        }],

        example: {
            description: "Split array by thrishold",
            code:   "<?javascript\r\n\r\n     var f1 = function(d){ \r\n         return d < 0\r\n         \r\n     };\r\n     var f2 = function(d){ \r\n         return d == 0\r\n         \r\n     };\r\n     var f3 = function(d){ \r\n         return d > 0\r\n         \r\n     };\r\n\r\n?>\r\nset('filters')\r\n\r\n<?json\r\n\r\n [-2, -1, 0, 1, 2]\r\n\r\n?>\r\nset('data')\r\n\r\nfilter({{filters.f1}})\r\ninfo()\r\n\r\nget(var:'data'), as:'json')\r\nfilter({{filters.f2}})\r\ninfo()\r\n\r\nget(var:'data'), as:'json')\r\nfilter({{filters.f3}})\r\ninfo()\r\nlog()\r\n\r\n"
        }
    }
}
