var mime = require("mime");
var path = require("path");
var logger = require("../../../log").global;
var util = require("util");

var ExportImplError = function(message) {
    this.message = message;
    this.name = "Command 'export' implementation error";
}
ExportImplError.prototype = Object.create(Error.prototype);
ExportImplError.prototype.constructor = ExportImplError;



var exportMap = {
    "text/csv": require("./csv"),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": require("./xlsx")
}

var impl = function(data, params, locale, script, scriptContext) {
    var filename = params.file;
    if (filename) {
        var mimeType = mime.lookup(path.basename(filename));
        var exporter = exportMap[mimeType]
        if (exporter) {
            try {
                return exporter(data, params, locale, script, scriptContext)
            } catch (e) {
                throw e
            }
        } else {
            throw new ExportImplError("Mime type: '" + mimeType + "' not supported");
        }

    } else {
        throw new ExportImplError("Cannot export empty file");
    }
}


module.exports = {
    name: "export",

    synonims: {
        "export": "export",
        "download": "export"
   },

    "internal aliases":{
        "file": "file"
     },
    
    defaultProperty: {
        "export": "file",
        "download": "file",
    },

    execute: function(command, state, config) {
        // if(!command.settings.file) throw "file name not found"
        if (!util.isString(command.settings.file))
            throw new ExportImplError("Incompatible file value: " + JSON.stringify(command.settings.file))

        try {
            state.head = {
                type: "url",
                data: impl(state.head.data, command.settings)
            }
        } catch (e) {
            throw e
        }
        return state;
    },
    help: {
        synopsis: "Export data as file",

        name: {
            "default": "export",
            synonims: ["export", "download"]
        },
        "default param": "file",
        params: [{
            name: "file",
            synopsis: "File name with extention",
            synonims: [],
            "default value": "none"
        }],
        example: {
            description: "export csv",
            code: "export('data.csv')"
        }
    }
}
