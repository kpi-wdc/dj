var util = require("util");

module.exports = {
    name: "count",
    synonims: {
        "count": "count"
    },

    defaultProperty: {},

    execute: function(command, state, config) {
        try {
          var res;  
          if(util.isArray(state.head.data)){
            res = state.head.data.length
          }else{
            if(util.isUndefined(state.head.data) || util.isNull(state.head.data)){
                res =0;
            }else{
                res = 1;
            }
          }  
            state.head = {
                data: res,
                type: "json"
            }
        } catch (e) {
            throw e }

        return state;
    },

    help: {
        synopsis: "Returns count of context items",

        name: {
            "default": "count",
            synonims: []
        },

        "default param": "none",

        params: [],

        example: {
            description: "Get length of array",
            code:  "<?json\n\n[0,1,2]\n\n?>\n\ncount()\n"
        }
    }
}
