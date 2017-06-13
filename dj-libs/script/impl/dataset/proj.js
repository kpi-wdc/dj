// returns dataset query result
//  
var impl = require("./proj_impl");
var util = require("util")

var ProjectionImplError = function(message) {
    this.message = message;
    this.name = "Command 'projection' implementation error";
}
ProjectionImplError.prototype = Object.create(Error.prototype);
ProjectionImplError.prototype.constructor = ProjectionImplError;

module.exports = {
    name: "projection",

    synonims: {
        "projection": "projection",
        "proj": "projection",
        "query": "projection"
    },

    "internal aliases":{
        "dimension": "dimension",
        "dim": "dimension",

        "role": "role",
        "as": "role",

        "collection": "collection",
        "items": "collection",
        "values": "collection",
        

        "rows": "Rows",
        "row": "Rows",

        "columns": "Columns",
        "column": "Columns",
        "col": "Columns",

        "ignored": "Ignore",
        "ignore": "Ignore",
        "ign": "Ignore",

        "columns splitter": "Split Columns",
        "split-col": "Split Columns",
        "scol": "Split Columns",
        "cs": "Split Columns",
        "col-split": "Split Columns",

        "rows splitter": "Split Rows",
        "split-row": "Split Rows",
        "sr": "Split Rows",
        "rs": "Split Rows",
        "row-split": "Split Rows",
    },

    defaultProperty: {
        "projection": "projection",
        "proj": "projection",
        "query": "projection"
    },

    execute: function(command, state, config) {
        // console.log(JSON.stringify(command))
        if (state.head.type != "dataset")
            throw new ProjectionImplError("Incompatible context type: " + state.head.type)

        var params = command.settings;

        if (!params) throw new ProjectionImplError("All default settings not defined")

        if (!util.isArray(params))
            throw new ProjectionImplError("Incompatible projection value: " + JSON.stringify(params.projection))

        params.forEach(function(p, index) {
            if (!p.dimension) throw new ProjectionImplError("Id for dimension " + index + " not defined")
            if (!p.role) throw new ProjectionImplError("Role for dimension " + index + " not defined")
            if (p.role != "Rows" && p.role != "Columns" && p.role != "Ignore" && p.role != "Split Columns" && p.role != "Split Rows")
                throw new ProjectionImplError("Incompatible role value: " + JSON.stringify(p.role) + " for dimension " + index);
            p.collection = (p.collection) ? p.collection : [];
            if (!util.isArray(p.collection))
                throw new ProjectionImplError("Incompatible collection value: " + JSON.stringify(p.collection) + " for dimension " + index);
        })


        try {
            state.head = {
                type: "table",
                data: impl(state.head.data, params)
            }
        } catch (e) {
            throw new ProjectionImplError(e.toString());
        }
        return state;
    },

    help: {
        synopsis: "Build table from dataset via data cube projection",

        name: {
            "default": "projection",
            synonims: ["projection", "proj", "query"]
        },
        input:["dataset"],
        output:"table",
        "default param": "projection",
        params: [{
            name: "dimension",
            synopsis: "Array of selections (required) such as {dimension: dim.id, role: [row, col, split-row, split-row, ign], values: array of dim.values.id}",
            type:["columns splitter", "split-col", "scol", "cs", "col-split", "rows splitter", "split-row", "sr", "rs", "row-split"],
            synonims: ["dimension", "dim"],
            "default value": 2
        },{
            name: "role",
            synopsis: "Array of selections (required) such as {dimension: dim.id, role: [row, col, split-row, split-row, ign], values: array of dim.values.id}",
            type:["ignored", "ignore", "ign"],
            synonims: ["role", "as"],
            "default value": "Ignore"
        },{
            name: "collection",
            synopsis: "Array of selections (required) such as {dimension: dim.id, role: [row, col, split-row, split-row, ign], values: array of dim.values.id}",
            type:["array of selections"],
            synonims: ["columns", "column", "col"],
            "default value": "none"
        }],
        example: {
            description: "Get projection from dataset",
            code:   "src(ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02')\r\njson()\r\ndataset()\r\nproj([{dim:'time', as:'row'},{dim:'indicator', as:'col'}])\r\n\r\n//or \r\n\r\nload(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02', \r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:'time', as:'row'},\r\n    {dim:'indicator', as:'col'}\r\n])\r\n\r\n\r\n//or \r\n\r\nload(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02', \r\n    as:'dataset',\r\n    into:'data'\r\n)\r\n\r\n// other data processing ...\r\n\r\nget(var:'data', as:'dataset')\r\n\r\nproj([\r\n    {dim:'time', as:'row'},\r\n    {dim:'indicator', as:'col'}\r\n])\r\n"
        }
    }
}
