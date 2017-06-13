// sort table rows(columns)
// 
require('string-natural-compare');
var transposeTable = require("./transpose").transpose;
var date = require("date-and-time");
var util = require("util");

var OrderImplError = function(message) {
    this.message = message;
    this.name = "Command 'order' implementation error";
}
OrderImplError.prototype = Object.create(Error.prototype);
OrderImplError.prototype.constructor = OrderImplError;

var Compare = {

    "geo": {
        "A-Z": function(a, b) {
            return String.naturalCompare((a + '').toLowerCase(), (b + '').toLowerCase())
        },
        "Z-A": function(a, b) {
            return String.naturalCompare((b + '').toLowerCase(), (a + '').toLowerCase())
        }
    },

    "metric": {
        "A-Z": function(a, b) {
            return a - b
        },
        "Z-A": function(a, b) {
            return b - a
        }
    },

    "time": {
        "A-Z": function(a, b) {
            return date.subtract(new Date(a), new Date(b)).toMilliseconds();
        },
        "Z-A": function(a, b) {
            return date.subtract(new Date(b), new Date(a)).toMilliseconds();
        }
    }
}

var impl = function(table, params) {
    // console.log("ORDER", JSON.stringify(params))
    // if(!params.order.enable) return table;
    var order = (params.order) ? params.order : params;
    var direction = (order.direction) ? order.direction : "Rows"; //"Columns"
    var asc = (order.asc) ? order.asc : "A-Z"; //"Z-A"
    var index = (order.index) ? order.index : 0;


    // String.alphbet = 
    // "0123456789"
    // +    "ABCDEFGH"
    // +    "АБВГҐДЕЄЁЖЗИ"
    // // + "JKLMNOPQRSTUVWXYZ"
    //  "abcdefgh"
    // +    "бвагґдеєёжзи"
    // +    "ijklmnopqrstuvwxyz"
    // // + "ЇЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
    // +    "іїйклмнопрстуфхцчшщъыьэюя";

    if (direction == "Columns") table = transposeTable(table, { transpose: true });

    var accessor = (index < 0) ? function(item) {
        return item.metadata[-index - 1].label } : function(item) {
        return item.value[index] }


    var comparator = (index < 0) ? (Compare[table.body[0].metadata[-index - 1].role]) ? Compare[table.body[0].metadata[-index - 1].role][asc] : Compare["geo"][asc] : Compare["metric"][asc]
        // (Compare[table.header[index].metadata[0].role])
        //  ? Compare[table.header[index].metadata[0].role][asc]
        //  : Compare["geo"][asc]


    table.body.sort(function(a, b) {
        return comparator(accessor(a), accessor(b))
    })


    if (direction == "Columns") table = transposeTable(table, { transpose: true });

    return table;
}

module.exports = {
    name: "order",

    synonims: {},

    "internal aliases":{
        "direction": "direction",
        "dir": "direction",
        "for": "direction",
        
        "Columns": "Columns",
        "col": "Columns",
        "Rows": "Rows",
        "row": "Rows",

        "as": "asc",
        "order": "asc",

        "A-Z": "A-Z",
        "az": "A-Z",
        "direct`": "A-Z",
        "Z-A": "Z-A",
        "za": "Z-A",
        "inverse": "Z-A",



        "index": "index",
        "by": "index"
    },

    defaultProperty: {},

    execute: function(command, state, config) {
        console.log('Settings', JSON.stringify(command))
        if (state.head.type != "table")
            throw new OrderImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;

        params = (params) ? {
            direction: params.direction || "Rows",
            asc: params.asc || "A-Z",
            index: params.index || 0
        } : {
            direction: "Rows",
            asc: "A-Z",
            index: 0
        }


        if (!util.isNumber(params.index))
            throw new OrderImplError("Incompatible index value: " + JSON.stringify(params.index) + ".")


        if (params.direction != "Rows" && params.direction != "Columns")
            throw new OrderImplError("Incompatible direction value: " + JSON.stringify(params.direction) + ".")

        if (params.asc != "A-Z" && params.asc != "Z-A")
            throw new OrderImplError("Incompatible asc value: " + JSON.stringify(params.asc) + ".")

        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new OrderImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Sort table",

        name: {
            "default": "order",
            synonims: []
        },
        input:["table"],
        output:"table",
        "default param": "index",
        params: [{
                name: "direction",
                synopsis: "Direction of  iteration (optional)",
                type:["Rows", "row", "Columns", "col"],
                synonims: ["direction", "dir", "for"],
                "default value": "Columns"
            }, {
                name: "asc",
                synopsis: "Define order (optional)",
                type:["A-Z", "az", "direct", "Z-A", "za", "inverse"],
                synonims: ["order", "as"],
                "default value": "A-Z"
            }, {
                name: "index",
                synopsis: "0-based index of item that will be used as values (optional). If index < 0, then will be used -1-based index of metadata values",
                type:["number"],
                synonims: ["index", "by"],
                "default value": 0
            }

        ],
        example: {
            description: "Sort table by first metadata values (time)",
            code:   "load(\r\n    ds:\"47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02\",\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    {dim:\"time\", as:\"row\"},\r\n    {dim:\"indicator\",as:\"col\"}\r\n])\r\n\r\norder(for:\"row\",by:-1, as:\"az\")\r\n\r\nformat(2)\r\n\r\n"
        }
    }
}
