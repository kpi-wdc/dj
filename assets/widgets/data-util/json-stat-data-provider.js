"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

var jsinq = _interopRequire(require("jsinq"));

var JSONstat = _interopRequire(require("json-stat"));

require("jsinq-query");

var m = angular.module("app.widgets.data-util.json-stat-data-provider", []);

m.factory("JSONstatDataProvider", ["$http", function ($http) {

  //TODO define dualAccessible collection type getByIndex or [index], getById or (id) as jsonstat manier

  //Array.prototype.id = function(_id){
  //    return this.filter(function(item){
  //        return item.id && item.id ==_id
  //    })[0]
  //}

  var JSONstatDataProvider = (function (_JSONstatDataProvider) {
    var _JSONstatDataProviderWrapper = function JSONstatDataProvider(_x, _x2) {
      return _JSONstatDataProvider.apply(this, arguments);
    };

    _JSONstatDataProviderWrapper.toString = function () {
      return _JSONstatDataProvider.toString();
    };

    return _JSONstatDataProviderWrapper;
  })(function (data, dataURL) {
    if (JSONstatDataProvider.isCompatible(data)) {
      this.data = data;
      this.dataURL = dataURL;
      this.provider = JSONstat(data);
    }
  });

  JSONstatDataProvider.isCompatible = function (data) {
    // TO DO fast recognize data format

    var match = (function (_match) {
      var _matchWrapper = function match(_x, _x2) {
        return _match.apply(this, arguments);
      };

      _matchWrapper.toString = function () {
        return _match.toString();
      };

      return _matchWrapper;
    })(function (source, pattern) {
      if (typeof source !== typeof pattern) return false;
      var result = true;
      for (var key in pattern) {
        if (source.hasOwnProperty(key)) {
          result = result && match(source[key], pattern[key]);
          if (result == false) return false;
        }
      }
      return result;
    });

    var pattern = {
      value: [],
      dimension: {
        id: [],
        size: []
      }
    };
    return match(data, pattern);
  };

  JSONstatDataProvider.prototype = {

    dataFormat: "json-stat",
    dataFormatRef: "http://json-stat.org/",

    getDataURL: function getDataURL() {
      return this.dataURL;
    },

    getDatasetIdList: function getDatasetIdList() {
      return this.provider.id;
    },

    getDatasetLabels: function getDatasetLabels() {
      return this.provider.Dataset().label;
    },

    getById: function getById(collection, id) {
      return collection.filter(function (item) {
        return item.id && item.id == id;
      })[0];
    },

    getDatasets: function getDatasets() {
      var id = this.provider.id;

      var result = [];
      for (var i in id) {
        result.push({
          id: id[i],
          index: i,
          label: this.provider.Dataset(id[i]).label,
          source: this.provider.Dataset(id[i]).source,
          updated: this.provider.Dataset(id[i]).updated,
          length: this.provider.Dataset(id[i]).length
        });
        var dims = this.provider.Dataset(id[i]).id;
        var dimensions = [];

        //dimensions.id = function(_id) {
        //    return this.filter(function (item) {
        //        return item.id && item.id == _id
        //    })[0]
        //}

        for (var j in dims) {
          dimensions.push({
            id: dims[j],
            index: j,
            label: this.provider.Dataset(id[i]).Dimension(dims[j]).label,
            role: this.provider.Dataset(id[i]).Dimension(dims[j]).role,
            length: this.provider.Dataset(id[i]).Dimension(dims[j]).length
          });
          var cats = this.provider.Dataset(id[i]).Dimension(dims[j]).id;

          var categories = [];
          //categories.id = function(_id) {
          //    return this.filter(function (item) {
          //        return item.id && item.id == _id
          //    })[0]
          //}

          for (var k in cats) {
            categories.push({
              id: cats[k],
              index: k,
              label: this.provider.Dataset(id[i]).Dimension(dims[j]).Category(cats[k]).label
            });
          }
          dimensions[j].categories = categories;
        }
        result[i].dimensions = dimensions;
      }
      //console.log("getDatasets",result)
      return result;
    },

    getDimensions: function getDimensions(dataset) {
      var id = this.provider.Dataset(dataset).id;
      var labels = this.provider.Dataset(dataset).Dimension().label;
      var result = {};
      for (var i in id) {
        result[i] = { id: id[i], label: labels[i] };
      }
      //console.log("getDimensions",dataset,result)
      return result;
    },

    getCategories: function getCategories(dataset, dimension) {
      var id = this.provider.Dataset(dataset).Dimension(dimension).id;
      var labels = this.provider.Dataset(dataset).Dimension(dimension).label;
      var result = {};
      for (var i in id) {
        result[i] = { id: id[i], label: labels[i] };
      }
      //console.log("getCategories",dataset,result)
      return result;
    },

    getDatasetLabel: function getDatasetLabel(dataset) {
      return this.provider.Dataset(dataset).label;
    },

    getDatasetSource: function getDatasetSource(dataset) {
      return this.provider.Dataset(dataset).source;
    },

    getDatasetUpdated: function getDatasetUpdated(dataset) {
      return this.provider.Dataset(dataset).updated;
    },

    getDimensionList: function getDimensionList(dataset) {
      return this.provider.Dataset(dataset).id;
    },

    getDimensionLabels: function getDimensionLabels(dataset) {
      return this.provider.Dataset(dataset).Dimension().label;
    },

    getDimensionLabel: function getDimensionLabel(dataset, dimension) {
      return this.provider.Dataset(dataset).Dimension(dimension).label;
    },

    getDimensionIdList: function getDimensionIdList(dataset, dimension) {
      return this.provider.Dataset(dataset).Dimension(dimension).id;
    },

    getCategoryLabels: function getCategoryLabels(dataset, dimension) {
      return this.provider.Dataset(dataset).Dimension(dimension).label;
    },

    getCategoryLabel: function getCategoryLabel(dataset, dimension, category) {
      return this.provider.Dataset(dataset).Dimension(dimension).Category(category).label;
    },

    getDimensionMemberList: function getDimensionMemberList(dataset, dimension) {
      return this.provider.Dataset(dataset).Dimension(dimension).Category().label;
    },

    getData: function getData(dataset) {
      //console.log("STAT Dataset",dataset)

      var test = [];
      for (var i in dataset.dimensions) {
        var tmp = [];
        var cats = dataset.dimensions[i].selection.collection;
        var dim = dataset.dimensions[i].id;
        for (var j in cats) {
          var item = "r." + dim + " == ";
          item = angular.isString(cats[j].id) ? item + "'" + cats[j].id + "'" : item + cats[j].id;
          tmp.push(item);
        }
        test.push("(" + tmp.join("||") + ")");
      }
      test = test.join("&&");

      var queryStr = "from r in $0 where "/*(r.value != null) && "*/ + test + " select r";

      //console.log(queryStr)

      var data = this.provider.Dataset(dataset.id).toTable({ type: "arrobj", content: "id" });

      //                var data = this.provider.Dataset(dataset.id).toTable({vlabel:"Value",type:"object"});
      //console.log(data)

      var query = new jsinq.Query(queryStr);
      query.setValue(0, new jsinq.Enumerable(data));
      data = query.execute().toArray();
      //console.log(data)

      for (var i in data) {
        for (var j in data[i]) {
          if (j != "value") {
            data[i][j] = this.getById(this.getById(dataset.dimensions, j).categories, data[i][j]).label;
          }
        }
      }

      //console.log(data)

      var header = [];
      for (var key in data[0]) {
        header.push(key);
      }

      return { header: header, data: data };
    }

  };
  return JSONstatDataProvider;
}]);
//# sourceMappingURL=../data-util/json-stat-data-provider.js.map