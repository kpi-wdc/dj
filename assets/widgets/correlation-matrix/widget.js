import angular from 'angular';
import 'widgets/table/data-widget';
import 'widgets/data-dialogs/correlation-matrix-dialog';
import 'widgets/data-util/adapter';

const m = angular.module('app.widgets.correlation-matrix', [
  'app.widgets.data-widget',
  'app.widgets.data-util.adapter',
  'app.widgets.data-dialogs.correlation-matrix-dialog'
]);

m.controller('CorrelationMatrixCtrl', function ($scope, CorrelationMatrixDialog, DataWidget, CorrelationTableGenerator) {
  new DataWidget($scope, {
    dialog: CorrelationMatrixDialog,
    //decorationAdapter:DataTableDecorationAdapter,
    serieGenerator: CorrelationTableGenerator
  })
});
