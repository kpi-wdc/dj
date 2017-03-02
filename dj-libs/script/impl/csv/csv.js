
var CsvError = function(message) {
    this.message = message;
    this.name = "Command 'csv' implementation error";
}
CsvError.prototype = Object.create(Error.prototype);
CsvError.prototype.constructor = CsvError;

module.exports = {
    name: "csv",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "string") throw new CsvError("Incompatible context type: " + state.head.type+". Use context injection or 'str()' command to convert context to 'string' type")
        state.head.type = "csv";
        return state;
    },

    help: {
        synopsis: "Set 'csv' type for script context",

        name: {
            "default": "csv",
            synonims: []
        },
        input:["string"],
        output:"csv",
        "default param": "none",
        params: [],
        example: {
            description: "Set 'csv' type for script context",
            code: "<?csv\n\nDATE;HOUR;MINUTE;AVG;MIN;MAX;HH;H;L;LL;MEASURE\n20160101;0;;143.73;;;;;;;Rh/h\n20160101;1;;143.79;;;;;;;Rh/h\n20160101;2;;143.68;;;;;;;Rh/h\n\n?>\n\njson()\n\nset('data')\n\n<?javascript\n    $context.data.forEach(function(row){\n        row.DATE = _util.parse.date(row.DATE,\"YYYYMMDD\")\n        row.AVG  = _util.parse.number(row.AVG)   \n    })\n?>\n\nget('data')\n"
        }
    }
}
