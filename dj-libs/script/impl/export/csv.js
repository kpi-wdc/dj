var XLSX = require("node-xlsx");
var util = require("util");
var query = require("../../../query/query");
var flat = require("../../../deep-copy").plain;
var mime = require('mime');
var logger = require("../../../log").global;
var json2csv = require('json2csv');
var iconv = require('iconv-lite');
var fs = require("fs");


var CSVConverterError = function(message) {
    this.message = message;
    this.name = "CSV converter error";
}
CSVConverterError.prototype = Object.create(Error.prototype);
CSVConverterError.prototype.constructor = CSVConverterError;

var isWdcTable = function(data) {
    return data.header && data.body
}
var isWdcSource = function(data) {
    return (data.metadata && data.metadata.dataset && data.metadata.dimension && data.data)
}

var exportWdcSource = function(data) {
    var expData = data.data;
    var fields = Object.keys(expData[0]);
    return iconv.encode(
        new Buffer(
            json2csv({ data: expData, fields: fields, del: ";" })
        ),
        "win1251");
}



var exportWdcTable = function(gen) {

    logger.debug("EXPORT TABLE")

    var product = [{ name: "data", data: [] }];
    var dummyHeader = [];

    gen.body[0].metadata.forEach(function() { dummyHeader.push(null) })
    for (i in gen.header[0].metadata) {
        product[0].data
            .push(
                dummyHeader.concat(
                    new query().from(gen.header)
                    .map(function(item) {
                        return item.metadata[i].label
                    })
                    .get()
                )
            )
    }

    gen.body
        .map(function(item) {
            return item.metadata.map(function(c) {
                return c.label
            }).concat(item.value)
        })
        .forEach(function(item) {
            product[0].data.push(item)
        });

    var fields = [];
    product[0].data[0].forEach(function(f, i) { fields.push("f" + i) })
    var res = product[0].data.map(function(row) {
        var ne = {};
        row.forEach(function(v, i) {
            ne["f" + i] = v
        })
        return ne
    })
    return iconv.encode(
        new Buffer(
            json2csv({ data: res, fields: fields, del: ";" })
        ),
        "win1251");
}

var exportArray = function(data) {

    logger.debug("EXPORT ARRAY")

    var fields = flat(data[0]).map(function(item, index) {
        return "f" + index })
    var res = []

    data.forEach(function(row) {
        if (util.isPrimitive(row)) {
            res.push([row])
        } else {
            res.push(
                flat(row).map(function(item) {
                    return item.value })
            )
        }
    })


    res = res.map(function(item, index) {
        var ne = {};
        item.forEach(function(v, i) {
            ne["f" + i] = v
        })
        return ne
    })
    return iconv.encode(
        new Buffer(
            json2csv({ data: res, fields: fields, del: ";" })
        ),
        "win1251");
}

var exportObject = function(data) {

    logger.debug("EXPORT OBJECT")

    data = flat(data);
    var product = [{ name: "data", data: [] }]
    product[0].data.push(["key", "value"])
    data.forEach(function(row) {
        product[0].data.push([row.path, row.value])
    })

    return product;
}





module.exports = function(data, params, locale, script, scriptContext) {

    logger.debug("EXPORT CSV")
    try {
        if (isWdcSource(data)) {
            fs.writeFileSync("./.tmp/public/downloads/" + params.file, exportWdcSource(data));
            return { url: "/downloads/" + params.file }
        }
        if (isWdcTable(data)) {
            fs.writeFileSync("./.tmp/public/downloads/" + params.file, exportWdcTable(data));
            return { url: "/downloads/" + params.file }
        }
        if (util.isArray(data)) {
            fs.writeFileSync("./.tmp/public/downloads/" + params.file, exportArray(data));
            return { url: "/downloads/" + params.file }
        }
        if (util.isObject(data)) {
            fs.writeFileSync("./.tmp/public/downloads/" + params.file, exportObject(data));
            return { url: "/downloads/" + params.file }
        }
    } catch (e) {
        throw new CSVConverterError(e.toString())
    }
    throw new CSVConverterError("CSV converter not found. Supported context types: dataset, table, array, object.")
}
