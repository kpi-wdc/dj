// format numbers 
var util = require("util");


var FormatImplError = function(message) {
    this.message = message;
    this.name = "Command 'format' implementation error";
}
FormatImplError.prototype = Object.create(Error.prototype);
FormatImplError.prototype.constructor = FormatImplError;


var impl = function(table, params) {
    if (params.precision != undefined && params.precision != null && params.precision >= 0) {
        table.body.forEach(function(currentRow) {
            currentRow.value = currentRow.value.map(function(item) {
                    return (item == null) ? null :
                        (!isNaN(new Number(item))) ? new Number(item).toFixed(params.precision) / 1 :
                        item
                })
                // console.log(currentRow.value)
        })
    }
    return table;
}

module.exports = {
    name: "format",

    synonims: {
        "format": "format",
        "nums": "format"
    },

    "internal aliases":{
        "precision": "precision",
        "p": "precision"
    },

    defaultProperty: {
        "format": "precision",
        "nums": "precision"
    },

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new FormatImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;
        command.settings.precision = command.settings.precision || 2
        if (!util.isNumber(command.settings.precision))
            throw new FormatImplError("Incompatible precision value: " + JSON.stringify(command.settings.precision) + ".")

        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new FormatImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Format numbers with fixed precision",

        name: {
            "default": "format",
            synonims: ["format", "nums"]
        },
        input:["table"],
        output:"table",
        "default param": "precision",
        params: [{
            name: "precision",
            synopsis: "Number precision",
            type:["number"],
            synonims: ["precision", "p"],
            "default value": 2
        }],
        example: {
            description: "Format table values with precision 3",
            code:   "load(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\n\r\nformat(3)\r\n"
        }
    }
}
