// generate geojson

var intersect = require("../lib/arrays").intersect;
var geodata = require("../../wdc-geojson.js").geodata;
var STAT = require("../lib/stat");
var transposeTable = require("../table/transpose").transpose;
var UTIL = require("util");
var _ = require("lodash-node/compat/array");
var copy = require("copy-object");
var date = require("date-and-time");

var deepCopy = function(obj) {

    if (UTIL.isArray(obj)) {
        return obj.map(function(item) {
            return deepCopy(item) })
    }

    if (UTIL.isObject(obj)) {
        var r = {};
        for (var i in obj) {
            r[i] = deepCopy(obj[i])
        }
    }

    return obj;
}

module.exports = function(table, params) {

    if (!params) return {};

    params.direction = (params.direction) ? params.direction : "Rows";
    params.dataIndex = (UTIL.isUndefined(params.dataIndex)) ? [0] : params.dataIndex;
    params.bins = (params.bins) ? params.bins : 1;
    params.scope = (params.scope) ? (params.scope) : "none";
    if (params.direction == "Rows") table = transposeTable(table, { transpose: true });

    if (table.body.length == 0) return {};

    var geoIndex = -1;
    table.header[0].metadata.forEach(
        function(item, index) {
            if (item.role == "geo") { geoIndex = index }
        })

    if (geoIndex < 0) return {};

    //create data table for geoChart


    var dataIndex = params.dataIndex.sort(function(a, b) {
        return a - b });

    dataIndex = dataIndex.map(function(item) {
        return {
            index: item,
            label: table.body[item].metadata.map(function(item) {
                    return UTIL.isDate(item.label) ? date.format(item.label, item.format) : item.label
                })
                .join(", "),
            values: table.body[item].value,
            max: STAT.max(table.body[item].value),
            min: STAT.min(table.body[item].value),
            categories: params.bins,
            ordinal: STAT.Ordinal(
                STAT.min(table.body[item].value),
                STAT.max(table.body[item].value),
                params.bins
            )
        }
    });

    var series = dataIndex.map(function(item) {
        return {
            key: item.label,
            min: item.min,
            max: item.max,
            cats: item.categories
        }
    })

    var attrs = [];
    for (var i = 0; i < table.body[0].value.length; i++) {
        attrs.push({
            geocode: table.header[i].metadata[geoIndex].id,
            values: (function(index) {
                var temp = [];
                dataIndex.forEach(function(di) {
                    temp.push({
                        // l : di.label,
                        v: di.values[index],
                        c: di.ordinal(di.values[index])
                    })
                })
                return temp;
            })(i)
        })
    }



    var geocodes = attrs.map(function(item) {
        return item.geocode });

    var geojs = deepCopy(geodata
        .filter(function(item) {
            if (!item.properties) return false
            if (!item.properties.geocode) return false

            return _.intersection(item.properties.geocode, geocodes).length > 0
        }))


    var res = [];
    attrs.forEach(function(a) {
        var g = geojs.filter(function(item) {
            return item.properties.geocode.indexOf(a.geocode) >= 0 })[0];
        if (g) {

            res.push({
                "type": g.type,
                "id": g.id,
                "properties": {
                    "geocode": deepCopy(g.properties.geocode),
                    "name": g.properties.name,
                    "scope": deepCopy(g.properties.scope),
                    "values": a.values
                },
                "geometry": g.geometry
            });
        }
    })

    var geoScope = (params.scope == "none") ? [] :
        geodata
        .filter(function(item) {
            if (!item.properties) return false
            if (!item.properties.geocode) return false
            return (_.intersection(item.properties.geocode, geocodes).length == 0) &&
                (item.properties.scope.indexOf(params.scope) >= 0)
        })
        .map(function(g) {
            return {
                "type": g.type,
                "id": g.id,
                "properties": {
                    "geocode": deepCopy(g.properties.geocode),
                    "name": g.properties.name,
                    "scope": deepCopy(g.properties.scope)
                },
                "geometry": g.geometry
            }
        })



    if (res.length == 0) {
        res = {}
    } else {
        res = res.concat(geoScope);

    }

    res.forEach(function(item) {
        item.properties.geocode = item.properties.geocode[0];
        item.properties.scope = undefined;
    })

    return [{ "series": series, features: res }]
}
