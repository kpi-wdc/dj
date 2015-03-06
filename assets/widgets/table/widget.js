import angular from 'angular';
import 'widgets/table/data-widget';
import 'widgets/data-dialogs/data-table-dialog';
import 'widgets/data-util/adapter';

const m = angular.module('app.widgets.table', [
  'app.widgets.data-widget',
  'app.widgets.data-dialogs.data-table-dialog',
  'app.widgets.data-util.adapter'
]);

//
//m.service('DataTableDecorationAdapter', function () {
//    this.applyDecoration = function (options, decoration) {
//        if(angular.isDefined(decoration)&&angular.isDefined(options)) {
//            options.title.text = decoration.title;
//            options.subtitle.text = decoration.subtitle;
//            options.caption.text = decoration.caption;
//            options.header = decoration.header;
//
//           }
//        return options;
//    }
//    this.getDecoration = function (options){
//        if(angular.isDefined(options)) {
//            var decoration = {}
//            decoration.title = options.title.text;
//            decoration.subtitle = options.subtitle.text;
//            decoration.caption = options.caption.text;
//            decoration.header = options.header;
//            return decoration;
//        }
//    }
//})

m.controller('TableCtrl', function ($scope, DataTableDialog, DataWidget, Normalizer) {
  new DataWidget($scope, {
    dialog: DataTableDialog,
    //decorationAdapter:DataTableDecorationAdapter,
    serieGenerator: {
      getData: function (table, scope) {
        return (scope.widget.decoration.normalize) ? Normalizer.getData(table, $scope) : table
      }
    }
  })
});
