var util = require("util");
var _ = require("lodash-node");
var Promise = require('bluebird')


var plain = function(object) {
    var result = [];

    var pathes = function(o, p) {
    	if (util.isFunction(o) || util.isDate(o) || util.isString(o) || util.isNumber(o) || util.isBoolean(o) || util.isNull(o)) {
            result.push({ path: p, value: o })
            return
        }

        if (o instanceof Promise){
            result.push({ path: p, value: o })
            return
        }

        if (util.isArray(o)) {
            o.forEach(function(item, index) {
                pathes(item, p + ".[" + index + "]")
            })
            return
        }

        if (util.isObject(o)) {
            for (key in o) {
                pathes(o[key], p + "." + key)
            }
            return
        }


    }

    if ( util.isFunction(object) 
        || util.isDate(object) 
        || util.isString(object) 
        || util.isNumber(object) 
        || util.isBoolean(object) 
        || util.isNull(object)
        || object instanceof Promise
        ) {
        result.push({
            path: ".",
            value: object
        })
    } else {
        pathes(object, []);
    }

    result = result.map(function(item) {
        return {
            path: item.path.substring(1, item.path.length),
            value: item.value
        }
    })
    return result;
}



var apply = function(o, p) {

    var applyPath = function(o, p, v) {

        p = p.split(".");
        var current = o;

        p.forEach(function(item, index) {

            if (item.indexOf("[") == 0) {
                var key = new Number(item.substring(1, item.length - 1))
                if (!current[key]) {
                    if (key > (current.length - 1)) {
                        for (var i = (current.length - 1); i < key; i++) {
                            current.push({})
                        }
                    }
                }
                if (index == p.length - 1) {
                    current[key] = v
                } else {
                    if (p[index + 1].indexOf("[") == 0) {
                        current[key] = (util.isArray(current[key])) ? current[key] : [];
                    } else {
                        current[key] = current[key] || {};
                    }
                }
                current = current[key]
            } else {
                if ((index < p.length - 1) && p[index + 1].indexOf("[") == 0) {
                    current[item] = (index == p.length - 1) ? v : current[item] || [];
                } else {
                    current[item] = (index == p.length - 1) ? v : current[item] || {};
                }
                current = current[item];
            }
        });
        return o;
    }


    if (!util.isArray(p)) {
        p = [p];
    }

    p.forEach(function(item) {
        applyPath(o, item.path.replace(/([^\.])(\[)/g,"$1.["), item.value)
    })

    return o;

}


var deepCopy = function(obj) {
    if (obj instanceof Promise) return obj;
    if (util.isDate(obj)) return obj;//new Date(obj)
    if (util.isString(obj)) return obj;//new String(obj)

    if (util.isNumber(obj) || util.isBoolean(obj) || util.isFunction(obj) || util.isNull(obj) || util.isUndefined(obj)) return obj;

    var result = null;
    if (util.isObject(obj)) result = obj;
    if (util.isObject(obj) || util.isArray(obj))
        result = (util.isArray(obj)) ? apply([], plain(obj)) : apply({}, plain(obj))
    return result
}

deepCopy.apply = function(obj, path, value) {
    return apply(obj, path, value)
}

deepCopy.plain = function(obj) {
    return plain(obj)
}

module.exports = deepCopy;
