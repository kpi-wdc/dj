// join tables

var Query = require("../../../query/query");
var util = require("util");



var JoinImplError = function(message) {
    this.message = message;
    this.name = "Command 'join' implementation error";
}
JoinImplError.prototype = Object.create(Error.prototype);
JoinImplError.prototype.constructor = JoinImplError;


var impl = function(tables, params) {

    // if(!params.join) return tables;
    // if(!params.join.enable) return tables;
    var join = (params.join) ? params.join : params;
    var result = { metadata: {} };
    // var direction = join.direction || "Rows";
    var joinMode = join.mode || "left"; // "inner"// "outer"
    joinMode = (joinMode == "left join") ? "left" : joinMode;
    joinMode = (joinMode == "inner join") ? "inner" : joinMode;
    joinMode = (joinMode == "outer join") ? "outer" : joinMode;

    var as = join.as || "";
    var suf = join.suffix || "";
    var metaTest = join.test || [
        [0, 0]
    ]; // [t1.metadataindex. t2metadataindex]

    var table1 = (tables.forEach) ? tables[0] : tables;
    var table2 = (tables.forEach) ? tables[1] : (join["with"]) ? join["with"] : table1;

    if (!table2.header || !table2.body) throw "Table 'with' not defined"
        // console.log("TABLE1", JSON.stringify(table1))
        // console.log("TABLE2", JSON.stringify(table2))
        // console.log(metaTest)

    table1.header.forEach(function(col) {
        var cc = col.metadata.map(function(m) {
            return m.label
        }).join(",")
        col.metadata = [{
            id: cc,
            label: cc,
            dimension: "Concatenated Meta",
            dimensionLabel: "Concatenated Meta"
        }]

    })


    table2.header.forEach(function(col) {
        var cc = col.metadata.map(function(m) {
            return m.label
        }).join(",")
        col.metadata = [{
            id: cc,
            label: as + cc + suf,
            dimension: "Concatenated Meta",
            dimensionLabel: "Concatenated Meta"
        }]

    })


    result.header = table1.header
        .map(function(item) {
            return item
        })
        .concat(
            table2.header
            .map(function(item) {
                return item
            })
        );

    var equalsMetas = function(m1, m2, test) {

        var f = test.length > 0;
        test.forEach(function(t) {
            f &= (m1[t[0]].dimension == m2[t[1]].dimension) && (m1[t[0]].id == m2[t[1]].id)
        })
        return f;
    }

    var nulls = function(count) {
        var _r = [];
        while (count-- > 0) _r.push(null)
        return _r;
    }

    if (joinMode == "left") {
        result.body = new Query()
            .from(table1.body)
            .wrap("a")
            .leftJoin(
                new Query()
                .from(table2.body)
                .wrap("b")
                .get(),
                function(r1, r2) {
                    if (join.criteria) return join.criteria(r1.a, r2.b)
                    return equalsMetas(r1.a.metadata, r2.b.metadata, metaTest)
                }
            )
            .map(function(row) {
                return {
                    metadata: row.a.metadata,
                    value: row.a.value.concat((row.b) ? row.b.value : nulls(table2.header.length))
                }
            })
            .distinct()
            .get()
        return result;
    }
    if (joinMode == "inner") {
        result.body = new Query()
            .from(table1.body)
            .wrap("a")
            .innerJoin(
                new Query()
                .from(table2.body)
                .wrap("b")
                .get(),
                function(r1, r2) {
                    if (join.criteria) return join.criteria(r1.a, r2.b)
                    return equalsMetas(r1.a.metadata, r2.b.metadata, metaTest)
                }
            )
            .map(function(row) {
                return {
                    metadata: row.a.metadata,
                    value: row.a.value.concat((row.b) ? row.b.value : nulls(table2.header.length))
                }
            })
            .distinct()
            .get()
        return result;
    }

    if (joinMode == "outer") {
        result.body = new Query()
            .from(table1.body)
            .wrap("a")
            .outerJoin(
                new Query()
                .from(table2.body)
                .wrap("b")
                .get(),
                function(r1, r2) {
                    if (join.criteria) return join.criteria(r1.a, r2.b)
                    return equalsMetas(r1.a.metadata, r2.b.metadata, metaTest)
                }
            )
            .map(function(row) {
                return {
                    metadata: (row.a) ? row.a.metadata : row.b.metadata,
                    value: (row.a) ? row.a.value.concat(
                        (row.b) ? row.b.value : nulls(table2.header.length)
                    ) : (nulls(table1.header.length)).concat(row.b.value)
                }
            })
            .distinct()
            .get()
        return result;
    }

    return result;
}

module.exports = {
    name: "join",

    synonims: {
        "join": "join"
    },

    "internal aliases":{
        "mode": "mode",
        "method": "mode",
        "prefix": "as",
        "pref": "as",
        "suffix": "suffix",
        "suff": "suffix",
        "criteria": "criteria",
        "on": "criteria",
        "test": "test",
        "left": "left",
        "outer": "outer",
        "inner": "inner",
        "with": "with"
    },

    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table")
            throw new JoinImplError("Incompatible context type: '" + state.head.type + "'.")
        var table = state.head.data;
        var params = command.settings;
        if (!params) throw new JoinImplError("All default settings not defined.")
        if (!params.with) throw new JoinImplError("Table 'with' not defined.")
        if (!params.criteria && !params.test) throw new JoinImplError("Condition 'on' not defined.")

        params = {
            "with": params.with,
            criteria: params.criteria,
            test: params.test,
            as: params.as,
            suffix: params.suffix,
            mode: params.mode || "left"
        }

        if (params.mode != "left" && params.mode != "outer" && params.mode != "inner")
            throw new JoinImplError("Mode '" + params.mode + "' not supported.")
        if (params.test && !util.isArray(params.test))
            throw new JoinImplError("Incompatible test value: " + JSON.stringify(params.test) + ".")
        if (params.criteria && !util.isFunction(params.criteria))
            throw new JoinImplError("Incompatible criteria value: " + params.criteria + ".")


        try {
            state.head = {
                type: "table",
                data: impl(table, params)
            }
        } catch (e) {
            throw new JoinImplError(e.toString())
        }
        return state;
    },
    help: {
        synopsis: "Join tables",

        name: {
            "default": "join",
            synonims: []
        },
        input:["table"],
        output:"table",
        "default param": "none",
        params: [{
            name: "with",
            synopsis: "Json path to stored table (required)",
            type:["bindable"],
            synonims: [],
            "default value": "none"
        }, {
            name: "mode",
            synopsis: "Join mode (optional)",
            type:["left", "inner", "outer"],
            synonims: ["mode", "method"],
            "default value": "left"
        }, {
            name: "as",
            synopsis: "Joined columns metadata prefix (optional)",
            type:["string"],
            synonims: ["prefix", "pref"],
            "default value": ""
        }, {
            name: "suffix",
            synopsis: "Joined columns metadata suffix (optional)",
            type:["string"],
            synonims: ["suffix", "suff"],
            "default value": ""
        }, {
            name: "test",
            synopsis: "Condition as array of 0-based metadata indexes  (optional)",
            type:["array of pairs of numbers"],
            synonims: [],
            "default value": [
                [0, 0]
            ]
        }, {
            name: "criteria",
            synopsis: "Condition as javascript callback  (optional)",
            type:["javascript callback via bindable"],
            synonims: ["criteria", "on"],
            "default value": "none"
        }],
        example: {
            description: "Explore methods of data normalization",
            code: "<?javascript\r\n\r\n    $context.eqFirstMeta = function(a,b){\r\n      return a.metadata[0].id == b.metadata[0].id\r\n    };\r\n\r\n?>\r\n\r\nload(\r\n    ds:'47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_02',\r\n    as:'dataset'\r\n)\r\n\r\nproj([\r\n    { dim:'time', as:'row'},\r\n    { dim:'indicator', as:'col'}\r\n])\r\n\r\nset('t1')\r\n\r\nnorm(for:'col', method:'0,1')\r\nset('t2')\r\n\r\nget(var:'t1', as:'table')\r\nnorm(for:'col', method:'std')\r\nset('t3')\r\n\r\nget(var:'t1', as:'table')\r\nnorm(dir:'col', method:'log')\r\nset('t4')\r\n\r\nget(var:'t1', as:'table')\r\n\r\njoin( \r\n    with:{{t2}}, \r\n    on:{{eqFirstMeta}}, \r\n    method:'left', \r\n    pref:'Ranged '\r\n)\r\n\r\njoin( \r\n    with:{{t3}}, \r\n    on:{{eqFirstMeta}},\r\n    method:'left', \r\n    pref:'Standartized '\r\n)\r\n\r\njoin( \r\n    with:{{t4}}, \r\n    on:{{eqFirstMeta}},\r\n    method:'left', \r\n    pref:'Logistic '\r\n)\r\n\r\nformat(3)\r\n\r\n"
        }
    }
}
