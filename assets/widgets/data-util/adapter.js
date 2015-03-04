"use strict";

require.config({
  paths: {
    stat: "widgets/data-util/stat",
    pca: "widgets/data-util/pca",
    cluster: "widgets/data-util/cluster"
  }
});


define(["angular", "jsinq", "jsinq-query", "stat", "pca", "cluster"], function (angular, jsinq) {
  var m = angular.module("app.widgets.data-util.adapter", ["app.widgets.data-util.stat", "app.widgets.data-util.pca", "app.widgets.data-util.cluster"]);


  m.service("TableGenerator", function () {
    var str = function (arg) {
      return angular.isString(arg) ? "'" + arg + "'" : arg;
    };

    this.getData = function (conf, provider) {
      if (angular.isUndefined(conf) && angular.isUndefined(provider)) return undefined;

      if (angular.isDefined(conf)) {
        if (conf.standalone && conf.series) return conf.series;
      }

      if (angular.isDefined(provider)) {
        var result = provider.getData(conf.selectedDataset);
        //console.log(result)

        var rowsDim, columnsDim, splitDim, rowCollection, columnCollection, splitCollection;


        for (var i in conf.selection) {
          if (conf.selection[i].role == "Rows") {
            rowsDim = i;
            rowCollection = conf.selection[i].collection;
          }
          if (conf.selection[i].role == "Columns") {
            columnCollection = conf.selection[i].collection;
            columnsDim = i;
          }
          if (conf.selection[i].role == "Split Columns") {
            splitDim = i;
            splitCollection = conf.selection[i].collection;
          }
        }

        var r = [];

        for (var row in rowCollection) {
          // get current row from this.result
          var qr = "from r in $0 where r." + conf.selectedDataset.dimensions[rowsDim].id + " == " + str(rowCollection[row].label) + " select r";
          //console.log(qr)
          var query = new jsinq.Query(qr);
          query.setValue(0, new jsinq.Enumerable(result.data));
          var rowData = query.execute().toArray();
          var current = {};
          current.label = rowCollection[row].label;
          current.id = rowCollection[row].id;
          current.values = {};

          for (var column in columnCollection) {
            //    get current record for current column
            var qc = "from r in $0 where r." + conf.selectedDataset.dimensions[columnsDim].id + " == " + str(columnCollection[column].label) + " select r";
            //console.log(qc)
            var query = new jsinq.Query(qc);
            query.setValue(0, new jsinq.Enumerable(rowData));
            var colData = query.execute().toArray();
            //console.log("Coldata", colData);
            if (!splitCollection) {
              for (var rr in colData) {
                //colData[rr].value = (colData[rr].value)?colData[rr].value : undefined;
                current.values[columnCollection[column].label] = colData[rr].value;
                //current.values[columnCollection[column].id]=colData[rr].value;
              }
            } else {
              for (var splitter in splitCollection) {
                var q = "from r in $0 where r." + conf.selectedDataset.dimensions[splitDim].id + " == " + str(splitCollection[splitter].label) + " select r";
                //console.log(q)
                var query = new jsinq.Query(q);
                query.setValue(0, new jsinq.Enumerable(colData));
                var splitData = query.execute().toArray();
                for (var rr in splitData) {
                  //splitData[rr].value = (splitData[rr].value) ? splitData[rr].value : undefined;
                  current.values[columnCollection[column].label + ", " + splitCollection[splitter].label] = splitData[rr].value;
                  //current.values[columnCollection[column].id+", "+splitCollection[splitter].id]=splitData[rr].value;
                }
              }
            }
          }
          r.push(current);
        }
        var header = {};
        header.label = conf.selectedDataset.dimensions[rowsDim].label;
        header.body = {};
        //console.log("ColumnsCollection",columnCollection)
        for (var i in r[0].values) {
          header.body[i] = {};
          header.body[i].label = i;
          header.body[i].title = i;
          var fcol = columnCollection.filter(function (item) {
            return item.label == i;
          })[0];

          if (fcol) {
            header.body[i].id = fcol.id;
          }
        }
        //console.log(r)
        //r = r.filter(function(item){
        //    for(var i in item.values){
        //        if (angular.isUndefined(item.values[i])
        //            || isNaN(item.values[i]) || item.values[i] == null ) return false;
        //    }
        //    return true;
        //})

        return { header: header, body: r };
      }
    };

    this.sortTable = function (table) {
      if (!table.header.coordX) {
        var item;
        for (var i in table.header.body) {
          if (table.header.body[i].coordX == true) {
            item = table.header.body[i];
            break;
          }
        }
        if (item) {
          table.body.sort(function (a, b) {
            var result;
            if (angular.isNumber(a.values[item.label])) {
              result = a.values[item.label] - b.values[item.label];
            }
            if (angular.isString(a.label)) {
              result = a.values[item.label] < b.values[item.label] ? -1 : 1;
            }
            if (item.order == "Z-A") {
              result = -result;
            }
            return result;
          });
        }
      } else {
        table.body.sort(function (a, b) {
          var result;
          if (angular.isNumber(a[table.header.coordX])) {
            result = a[header.coordX] - b[header.coordX];
          }
          if (angular.isString(a[table.header.coordX])) {
            result = a[table.header.coordX] < b[table.header.coordX] ? -1 : 1;
          }
          if (table.header.order == "Z-A") {
            result = -result;
          }
          return result;
        });
      }
    };
  });

  m.service("BarSerieGenerator", function () {
    this.getData = function (table) {
      //console.log("Table", table)
      var result = [];
      for (var i in table.body) {
        var v = [];
        for (var j in table.body[i].values) {
          v.push({ label: j, value: table.body[i].values[j] });
        }
        result.push({ key: table.body[i].label, values: v });
      }
      //console.log("Result", result)
      return result;
    };
  });

  m.service("MapSerieGenerator", function () {
    this.getRange = function (row) {
      var values = [];
      for (var j in row) {
        values.push(row[j]);
      }
      values.sort(function (a, b) {
        return a - b;
      });
      return {
        max: values[values.length - 1],
        min: values[0]
      };
    };

    this.getData = function (table, scope) {
      // console.log("SCOPE", scope.widget.decoration);
      var result = [];
      for (var i in table.body) {
        var v = [];
        var range = this.getRange(table.body[i].values);

        for (var j in table.body[i].values) {
          var cat;
          if (!isNaN(table.body[i].values[j])) {
            cat = Math.floor((table.body[i].values[j] - range.min) / (range.max - range.min) * scope.widget.decoration.color.length);
            cat = cat >= scope.widget.decoration.color.length ? scope.widget.decoration.color.length - 1 : cat;
          }
          v.push({
            label: j,
            value: table.body[i].values[j],
            id: table.header.body[j].id,
            category: table.body[i].values[j] == null ? undefined : cat
          });
        }
        var boundaries = [];
        for (var k = 0; k <= scope.widget.decoration.color.length; k++) {
          boundaries.push((range.min + k * (range.max - range.min) / scope.widget.decoration.color.length).toPrecision(3));
        }

        result.push({
          key: table.body[i].label,
          cats: scope.widget.decoration.color.length,
          range: range,
          boundaries: boundaries,
          values: v });
      }
      //console.log("Result", result)
      return result;
    };
  });

  m.service("CorrelationMatrixGenerator", ["BarSerieGenerator", "STAT", function (BarSerieGenerator, STAT) {
    this.getData = function (table) {
      var series = BarSerieGenerator.getData(table);
      for (var i in series) {
        series[i].values = series[i].values.map(function (item) {
          return item.value;
        });
      }
      //console.log("CORRELATION PREPARED SERIES",series);
      var result = [];
      for (var i = 0; i < series.length; i++) {
        var row = [];
        for (var j = 0; j < series.length; j++) {
          row.push({ label: series[j].key, value: STAT.corr(series[i].values, series[j].values) });
        }
        result.push({ key: series[i].key, values: row });
      }
      //console.log("CORRELATION MATRIX",result);
      return result;
    };
  }]);


  m.service("CorrelationTableGenerator", ["CorrelationMatrixGenerator", function (CorrelationMatrixGenerator) {
    this.getData = function (table) {
      var matrix = CorrelationMatrixGenerator.getData(table);
      var result = {};


      result.body = matrix.map(function (item) {
        var current = {};
        for (i in item.values) {
          current[item.values[i].label] = item.values[i].value;
        }
        return { label: item.key, values: current };
      });

      result.body.sort(function (a, b) {
        return a.label > b.label ? 1 : -1;
      });

      //var keys = result.body.map(function(item){return item.label});
      //for(var i=0; i<keys.length; i++){
      //    for(var j=i; j<keys.length; j++){
      //        result.body[i].values[keys[j]] = undefined;
      //    }
      //}


      //console.log(result.body);


      result.header = {};
      result.header.label = table.label;
      result.header.body = {};
      for (var i in result.body[0].values) {
        result.header.body[i] = {};
        result.header.body[i].label = i;
        result.header.body[i].title = i;
      }
      //console.log("CORRELATION TABLE", result);
      return result;
    };
  }]);

  m.service("DistributionSerieGenerator", ["BarSerieGenerator", function (BarSerieGenerator) {
    this.getData = function (table, scope) {
      var series = BarSerieGenerator.getData(table);
      var maxValue, minValue;

      for (var i in series) {
        series[i].values.sort(function (a, b) {
          return a.value - b.value;
        });
        var max = series[i].values[series[i].values.length - 1];
        var min = series[i].values[0];
        if (scope.widget.decoration.normalize) {
          series[i].values = series[i].values.map(function (item) {
            //console.log(item, min, max,((item.value - min) / (max - min)))
            return { label: item.label, value: (item.value - min.value) / (max.value - min.value) };
          });
          //max = 1;
          //min = 0;
        }
        maxValue = angular.isDefined(maxValue) ? Math.max(maxValue, max.value) : max.value;
        minValue = angular.isDefined(minValue) ? Math.min(minValue, min.value) : min.value;

        //console.log(series[i].values);
      }

      if (scope.widget.decoration.normalize) {
        maxValue = 1;
        minValue = 0;
      }
      //console.log(minValue,maxValue)
      var intervalCount = scope.widget.decoration.intervalCount ? scope.widget.decoration.intervalCount : 10;

      var result = [];
      for (var i in series) {
        var values = [];
        for (var j = 0; j < intervalCount; j++) {
          values.push({
            label: ((j + 0.5) * (maxValue - minValue) / intervalCount).toPrecision(3),
            x: ((j + 0.5) * (maxValue - minValue) / intervalCount).toPrecision(3),
            y: 0
          });
        }
        for (var j in series[i].values) {
          var index = Math.floor((series[i].values[j].value - minValue) / (maxValue - minValue) * intervalCount); //((range.max-range.min)/this.conf.decoration.color.length);
          index = index == intervalCount ? index - 1 : index;
          values[index].y += 1 / series[i].values.length;
        }

        if (scope.widget.decoration.cumulate) {
          var s = 0;
          values.forEach(function (val) {
            val.y = s += val.y;
          });
        }

        values = values.map(function (val) {
          return { label: val.label, x: val.x, y: val.y.toPrecision(3) };
        });
        result.push({ key: series[i].key, values: values });
      }
      return result;
    };
  }]);

  m.service("Normalizer", ["STAT", function (STAT) {
    this.getData = function (table, scope) {
      var normalizeMode = scope.widget.decoration.normalizeMode || "Range to [0,1]";
      var normalizeArea = scope.widget.decoration.normalizeArea || "Columns";

      var keys = Object.keys(table.header.body).sort(function (a, b) {
        return a < b ? -1 : 1;
      });


      if (normalizeArea == "Columns") {
        for (var i in keys) {
          var data = [];

          for (var j in table.body) {
            data.push(table.body[j].values[keys[i]]);
          }

          switch (normalizeMode) {
            case "Range to [0,1]":
              data = STAT.normalize(data);
              break;
            case "Standartization":
              data = STAT.standardize(data);
              break;
            case "Logistic":
              data = STAT.logNormalize(data);
              break;
          }
          data = data.map(function (item) {
            return Number(item.toPrecision(2));
          });
          for (var j in data) {
            table.body[j].values[keys[i]] = data[j];
          }
        }
      } else {
        for (var i in table.body) {
          var data = [];

          for (var j in keys) {
            data.push(table.body[i].values[keys[j]]);
          }

          switch (normalizeMode) {
            case "Range to [0,1]":
              data = STAT.normalize(data);
              break;
            case "Standartization":
              data = STAT.standardize(data);
              break;
            case "Logistic":
              data = STAT.logNormalize(data);
              break;
          }
          data = data.map(function (item) {
            return Number(item.toPrecision(2));
          });
          for (var j in keys) {
            table.body[i].values[keys[j]] = data[j];
          }
        }
      }
      return table;
    };
  }]);


  m.service("ScatterSerieGenerator", ["PCA", "STAT", "CLUSTER", "Normalizer", function (PCA, STAT, CLUSTER, Normalizer) {
    this.getClusterData = function (serie, scope) {
      var clsInputData = serie.values.map(function (item) {
        return [item.x, item.y];
      });
      var clusterCount = scope.widget.decoration.clusterCount;
      var clusters = CLUSTER.kmeans(clusterCount, clsInputData);
      //console.log(clusters);
      serie.radiusVector = true;
      serie.values.forEach(function (item, index) {
        //console.log(index,item);
        item.cluster = clusters.assignments[index];
        item.ox = clusters.centroids[clusters.assignments[index]][0];
        item.oy = clusters.centroids[clusters.assignments[index]][1];
      });
      //console.log(serie);

      var result = [];
      for (var i = 0; i < clusterCount; i++) {
        result.push({
          key: serie.key + " " + "Cls " + i,
          radiusVector: true,
          values: serie.values.filter(function (item) {
            return item.cluster == i;
          }),
          base: { title: "Loadings PC1" }
        });
      }

      result.push({
        key: "Centroids ",
        values: clusters.centroids.map(function (item, index) {
          return {
            label: "Centroid " + index,
            x: Number(item[0].toPrecision(2)),
            y: Number(item[1].toPrecision(2))
          };
        }),
        base: { title: "Loadings PC1" }
      });


      return result;
    };


    this.getPcaData = function (table, scope) {


      var data = PCA.getData(table);

      var serie = { key: "Principle Component 2", values: [], base: { title: "Principle Component 1" } };
      for (var i in table.body) {
        serie.values.push({
          label: table.body[i].label,
          x: Number(data.scores[i][0].toPrecision(2)),
          y: Number(data.scores[i][1].toPrecision(2))
        });
      }

      var loadings = {
        key: "Loadings PC2",
        radiusVector: true,
        values: [{ label: "0,0", x: 0, y: 0 }, { label: "", x: -1, y: -1 }, { label: "", x: 1, y: 1 }],
        base: { title: "Loadings PC1" }
      };

      var keys = Object.keys(table.header.body);
      keys.sort(function (a, b) {
        return a < b ? -1 : 1;
      });
      for (var i in keys) {
        loadings.values.push({
          label: table.header.body[keys[i]].label,
          ox: 0,
          oy: 0,
          x: Number(data.eigenVectors[i][0].toPrecision(2)),
          y: Number(data.eigenVectors[i][1].toPrecision(2))
        });
      }

      if (scope.widget.decoration.kmeans) {
        var result = this.getClusterData(serie, scope);
        result.push(loadings);
        return result;
      }
      return [serie, loadings];
    };


    this.getData = function (table, scope) {
      //console.log(PCA.getData(table))
      table.body = table.body.filter(function (item) {
        //console.log(item)
        for (var i in item.values) {
          if (angular.isUndefined(item.values[i]) || isNaN(item.values[i]) || item.values[i] == null) return false;
        }
        return true;
      });


      if (scope.widget.decoration.pca) return this.getPcaData(table, scope);

      if (scope.widget.decoration.normalize) {
        table = Normalizer.getData(table, scope);
        //var keys = Object.keys(table.header.body)
        //    .sort(function(a,b){
        //        return(a<b)?-1:1;
        //    })
        //
        //
        //for(var i in keys){
        //    var data = [];
        //
        //    for(var j in table.body){
        //        data.push(table.body[j].values[keys[i]])
        //    }
        //
        //    switch(scope.widget.decoration.normalizeMode){
        //        case "Range to [0,1]":
        //            data = STAT.normalize(data);
        //            break;
        //        case "Standartization":
        //            data = STAT.standardize(data);
        //            break;
        //        case "Logistic":
        //            data = STAT.logNormalize(data);
        //            break;
        //    }
        //    data = data.map(function(item){return Number(item.toPrecision(2))})
        //    for(var j in data){
        //            table.body[j].values[keys[i]] = data[j]
        //    }
        //}
      }


      var xValues = [];
      var labels = [];
      var base;
      if (table.header.coordX) {
        base = table.header.coordX;
        xValues = table.body.map(function (item, index) {
          if (angular.isUndefined(item[table.header.coordX])) return undefined;

          return isNaN(item[table.header.coordX]) ? undefined : Number(Number(item[table.header.coordX]).toFixed(4));
        });
      } else {
        var coordX;
        for (var i in table.header.body) {
          if (table.header.body[i].coordX == true) {
            coordX = i;
            break;
          }
        }
        if (coordX) {
          base = table.header.body[coordX];
          xValues = table.body.map(function (item, index) {
            if (angular.isUndefined(item.values[coordX])) return undefined;
            return isNaN(item.values[coordX]) ? undefined : Number(Number(item.values[coordX]).toFixed(4));
          });
        }
      }

      labels = table.body.map(function (item) {
        return item.label;
      });

      //console.log(labels);
      //console.log(xValues);
      var result = [];
      for (var i in table.header.body) {
        if (table.header.body[i].coordX != true) {
          var yValues = table.body.map(function (item, index) {
            //console.log(item)
            if (angular.isUndefined(item.values[i])) return undefined;
            return isNaN(item.values[i]) ? undefined : Number(Number(item.values[i]).toFixed(4));
          });
          //console.log(yValues)
          var values = [];
          for (var j in labels) {
            values.push({ label: labels[j], x: xValues[j], y: yValues[j] });
          }
          result.push({ key: table.header.body[i].label, base: base, values: values });
        }
      }
      //console.log(result)
      for (var i in result) {
        result[i].values = result[i].values.filter(function (item) {
          return angular.isDefined(item.x) && angular.isDefined(item.y) && !isNaN(item.x) && !isNaN(item.y);
        });
      }
      //console.log(result)
      return result;
    };
  }]);


  m.service("adapter", ["TableGenerator", function (TableGenerator) {


    this.getData = function (scope, serieGenerator) {
      var conf = scope.widget.data;
      var provider = scope.provider;

      if (angular.isUndefined(conf) && angular.isUndefined(provider)) return undefined;

      if (angular.isDefined(conf)) {
        if (conf.standalone && conf.series) return conf.series;
      }
      //console.log(conf)
      if (angular.isDefined(conf)) {
        if (conf.standalone && conf.table) return conf.table;
      }

      if (angular.isDefined(provider)) {
        //console.log("GET DATA ADAPTER",conf,provider,serieGenerator)

        var cfg = {};
        cfg.selectedDataset = provider.getDatasets().find(function (item) {
          return item.id == conf.selectedDataset;
        });

        for (var i in cfg.selectedDataset.dimensions) {
          cfg.selectedDataset.dimensions[i].selection = conf.selection[i];
        }

        cfg.selection = conf.selection;
        //console.log("CFG",cfg)
        var table = TableGenerator.getData(cfg, provider);
        if (conf.header) {
          table.header = conf.header;
          TableGenerator.sortTable(table);
        }
        return serieGenerator.getData(table, scope);
      }
    };
  }]);
});

