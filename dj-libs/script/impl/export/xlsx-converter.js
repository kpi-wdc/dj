var query = require('../../../query/query');
var util = require("util");
var flat = require("../../../deep-copy").plain;


module.exports = function(dataset) {
    var result = []

    if (dataset.metadata) {
        // console.log(dataset.metadata)
        layout = dataset.metadata.layout;
        dimension = dataset.metadata.dimension;

        dims = {};
        for (i in dimension) {
            dims[i] = layout[i].label;
            dims["#" + i] = layout[i].id;
        }
        dims["#value"] = layout.value;

        data = new query()
            .from(dataset.data)
            .map(function(item) {
                r = {};
                for (i in item) {
                    r[dims[i]] = item[i]
                }
                return r;
            })
            .get();

        result.push(json_to_sheet("data", data));

        metadata = new query()
            .from(flat(dataset.metadata))
            .map(function(item) {
                return { key: item.path, value: item.value }
            })
            .select(function(item) {
                return item.key.indexOf(".values[]") == -1
            })
            .get();


        result.push(json_to_sheet("metadata", metadata));
    }

    if (dataset.dictionary) {
        dictionary = new query()
            .from(dataset.dictionary)
            .select(function(item) {
                return item.type !== 'i18n';
            })
            .map(function(item) {
                r = {};
                flatted = flat(item);
                flatted.forEach(function(e) {
                    r[e.path] = e.value;
                });
                return r;
            })
            .get();

        result.push(json_to_sheet("dictionary", dictionary));

        i18n = new query()
            .from(dataset.dictionary)
            .select(function(item) {
                return item.type === 'i18n';
            })
            .map(function(item) {
                r = {};
                delete item.type;
                flatted = flat(item);
                flatted.forEach(function(e) {
                    r[e.path] = e.value;
                });
                return r;
            })
            .get();

        result.push(json_to_sheet("i18n", i18n));
    }
    return result
}
