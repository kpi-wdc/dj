require('string-natural-compare');
module.exports = [{
    name: "version",
    synonims: {
        "version": "version",
        "ver": "version"
    },

    defaultProperty: {},

    execute: function(command, state, config) {
        state.head = {
            type: "json",
            data: {
                name: "DJ Data Processing Script",
                version: "0.1.1",
                commands:  config
                    .map(function(item){return item.name})
                    .sort(function(a,b){return String.naturalCompare((a).toLowerCase(),(b).toLowerCase())})
                    .join(", ")+"."
            }
        }
        return state;
    },

    help: {
        synopsis: "Get DJ DP script version",
        name: {
            "default": "version",
            synonims: ["version", "ver"]
        },
        "default param": "none",
        params: [],
        example: {
            description: "Get DJ DP script version",
            code: "ver()"
        }

    }
}]
