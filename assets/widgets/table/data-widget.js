define([
    'angular',
    'angular-oclazyload',
    'widgets/data-util/adapter'
  ],
  function (angular) {


    var m = angular.module('app.widgets.data-widget',
      ['oc.lazyLoad',
        'app.widgets.data-util.adapter'
      ]);


    m.factory('DataWidget', ['$ocLazyLoad', 'APIProvider', 'APIUser', 'adapter', 'pageSubscriptions',

      function ($ocLazyLoad, APIProvider, APIUser, adapter, pageSubscriptions) {

        $ocLazyLoad.load({
          files: [
            '/widgets/table/data-widget.css'
          ]
        });

        var DataWidget = function ($scope, params) {

          //$scope.widget.decoration.colorize = false;
          //$scope.widget.decoration.colorizeMode = "None";
          //$scope.widget.decoration.opacity = 0.5;

          $scope.APIProvider = new APIProvider($scope);
          $scope.APIUser = new APIUser($scope);

          $scope.removeSubscriptions = function () {
            var subscriptions = pageSubscriptions();
            for (var i in subscriptions) {
              if (subscriptions[i].emitter == $scope.widget.instanceName
                || subscriptions[i].receiver == $scope.widget.instanceName
              )   subscriptions.splice(i, 1);

            }
          };

          $scope.dataValue = function (arg) {
            if (angular.isString(arg)) return arg;
            if (angular.isNumber(arg)) return arg.toFixed(2);
            return " - ";
          };

          $scope.tableExist = function () {
            return angular.isDefined($scope.table)
          };

          $scope.configExist = function () {
            return angular.isDefined($scope.widget.data)
          };


          $scope.RGBA = function (hex, opacity) {
            if (angular.isUndefined(hex)) return "rgba(" + 256 + "," + 256 + "," + 256 + "," + 1.0 + ")";

            var color = parseInt(hex.slice(1), 16);
            var r, g, b;
            if (hex.length === 4) {
              r = (color & 3840) >> 4;
              r = r >> 4 | r;
              g = color & 240;
              g = g >> 4 | g;
              b = color & 15;
              b = b << 4 | b;
            } else if (hex.length === 7) {
              r = (color & 16711680) >> 16;
              g = (color & 65280) >> 8;
              b = color & 255;
            }
            return "rgba(" + r + "," + g + "," + b + "," + opacity + ")"
          };

          $scope.getCellBackground = function (row, col, value) {
            if (angular.isUndefined(value))return "transparent";
            if ($scope.widget.decoration.colorize == false) return "transparent";
            if (!$scope.widget.decoration.color) return "transparent";
            var range;
            switch ($scope.widget.decoration.colorizeMode) {
              case "Rows":
                range = $scope.widget.decoration.ranges.rows[row.label];
                break;
              case "Columns":
                col = Object.keys(row.values).sort(function (a, b) {
                  return (a < b) ? -1 : 1
                })[col];
                range = $scope.widget.decoration.ranges.columns[col];
                break;
              case "All Cells":
                range = $scope.widget.decoration.ranges.all;
                break;
            }
            if (!range)return "transparent";

            var index = Math.floor(((value - range.min) / (range.max - range.min)) * $scope.widget.decoration.color.length);//((range.max-range.min)/this.conf.decoration.color.length);
            index = (index == $scope.widget.decoration.color.length) ? index - 1 : index;
            //console.log("BG ",row,col,value,range,index);

            return $scope.RGBA($scope.widget.decoration.color[index],
              (($scope.widget.decoration.opacity) ? $scope.widget.decoration.opacity : 0.5));

          };


          $scope.getCellStyle = function (row, col, value) {
            //console.log(arguments);
            if (arguments.length < 3)
              return {"background": "transparent"};
            return {"background": $scope.getCellBackground(row, col, value)}
          };

          $scope.setPredicate = function (f) {
            $scope.predicate = f;
            $scope.reverse = !$scope.reverse;
          },

            $scope.byLabel = function () {
              $scope.sortField = undefined;
              return function (item) {
                return item.label
              }
            };

          $scope.byField = function (field) {
            //console.log(field)
            $scope.sortField = field;
            return function (item) {
              return item.values[field.label]
            }
          };

          $scope.reverse = false;
          $scope.predicate = $scope.byLabel();


          $scope.APIProvider

            .config(function () {

              if ($scope.widget.data && $scope.widget.data.standalone) {
                $scope.table = $scope.widget.data.table;
                return;
              }
              if ($scope.widget.datasource) {
                $scope.APIUser.invoke($scope.widget.datasource, 'appendListener')
              }
            }, true)

            .removal(function () {
              $scope.removeSubscriptions();
            })

            .openCustomSettings(function () {
              $scope.dialog = new params.dialog($scope);
              $scope.dialog.open();
            })

            .provide('setDataProvider', function (evt, provider) {
              if (!provider) return;

              $scope.provider = provider;
              $scope.table = adapter.getData($scope, params.serieGenerator);
            });
        };

        return DataWidget;
      }]);
  });
