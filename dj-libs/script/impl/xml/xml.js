
var XmlError = function(message) {
    this.message = message;
    this.name = "Command 'xml' implementation error";
}
XmlError.prototype = Object.create(Error.prototype);
XmlError.prototype.constructor = XmlError;

module.exports = {
    name: "xml",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "string") throw new XmlError("Incompatible context type: " + state.head.type+". Use context injection or 'str()' command to convert context to 'string' type")
        state.head.type = "xml";
        return state;
    },

    help: {
        synopsis: "Set 'xml' type for script context",

        name: {
            "default": "xml",
            synonims: []
        },
        input:["string"],
        output:"xml",
        "default param": "none",
        params: [],
        example: {
            description: "Set 'xml' type for script context",
            code: "load(\n    url:'http://127.0.0.1:8080/api/resource/scripting-xml.xml',\n    as:'xml',\n    into:'external'\n)\n\n<?xml\n    <a><b>text</b></a>\n?>\nset('internal')\n\nget()\n\n"
        }
    }
}
