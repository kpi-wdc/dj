import angular from 'angular';
import jsinq from 'jsinq';
import 'jsinq-query';

const m = angular.module('app.widgets.data-util.table-adapter', []);
m.service('TableAdapter', function () {
  this.getData = function (series) {
    console.log("TableAdapter", series);
    var result = [];
    // generate [{key:"",values:[]}]
    for (var j in series[0].values) {
      var row = {};
      var values = [];
      for (var i in series) {
        values.push({label: series[i].key, value: series[i].values[j].value});
      }
      row.values = values;
      result.push(row);
    }
    return result;
  }
});
