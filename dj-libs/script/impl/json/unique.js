var query = require("../../../query/query");
var util = require("util")

var UniqueImplError = function(message) {
    this.message = message;
    this.name = "Command 'unique' implementation error";
}
UniqueImplError.prototype = Object.create(Error.prototype);
UniqueImplError.prototype.constructor = UniqueImplError;


module.exports = {
        name: "unique",
        synonims: {
            "unique": "unique",
            "uniq": "unique",
            "u": "unique",
            "dist": "unique",
            "distinct": "unique"
        },
        defaultProperty: {},

        execute: function(command, state, config) {
            if (state.head.type != "json") throw new UniqueImplError("Incompatible context type: '" + state.head.type + "' Use 'json()' command for convert context to 'json' type.")
                    try {
                        if (util.isArray(state.head.data)) {
                            var res = new query()
                                .from(state.head.data)
                                .distinct()
                                .get()
                            state.head = {
                                data: res,
                                type: "json"
                            }
                        }

                        return state;

                    } catch (e) {
                        throw new UniqueImplError(e.toString())
                    }
                },

                help: {
                    synopsis: "Returns unique values from script context",

                    name: {
                        "default": "unique",
                        synonims: ["unique", "uniq", "dist", "distinct"]
                    },
                    input:["json"],
                    output:"json",
                    "default param": "none",
                    params: [],
                    example: {
                        description: "Returns unique values",
                        code: "<?json\r\n    [3,1,3,2,2,2,3,1,1,3,2]\r\n?>\r\n\r\nunique()\r\n\r\n"

                    }
                }
        }
