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
            code:   "<%\n"+
                    " var f1 = function(d){ return d < 0}\n"+
                    " var f2 = function(d){ return d == 0}\n"+
                    " var f3 = function(d){ return d > 0}\n"+
                    "%>\n"+
                    "js()\n"+
                    "set('filters')\n"+
                    "<%\n"+
                    " [-2, -1, 0, 1, 2]\n"+
                    "%>\n"+
                    "json()\n"+
                    "set('data')\n"+
                    "filter('{{filters.f1}}')\n"+
                    "info()\n"+
                    "get('data')json()\n"+
                    "filter('{{filters.f2}}')\n"+
                    "info()\n"+
                    "get('data')json()\n"+
                    "filter('{{filters.f3}}')\n"+
                    "info()\n"+
                    "log()"
        }
    }
}
