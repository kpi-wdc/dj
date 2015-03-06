import angular from 'angular';
import 'widgets/data-util/keyset';
import 'widgets/data-util/adapter';
import 'widgets/data-dialogs/palettes1';

const m = angular.module('app.widgets.data-dialogs.radar-chart-dialog', [
  'app.widgets.data-util.keyset',
  'app.widgets.data-util.adapter',
  'mm.foundation',
  'app.widgetApi',
  'app.widgets.palettes1'
]);

m.factory("RadarChartDialog", ['KeySet', 'TableGenerator', 'BarSerieGenerator', '$modal',
  'APIUser', 'APIProvider', 'pageSubscriptions', 'pageWidgets',
  'Palettes1',

  function (KeySet, TableGenerator, BarSerieGenerator, $modal,
            APIUser, APIProvider, pageSubscriptions, pageWidgets,
            Palettes1) {

    var RadarChartDialog = function (scope) {

      this.scope = scope;
      this.conf = {}
      this.dsList = pageWidgets()
        .filter(function (item) {
          return item.type == "datasource"
        })
        .map(function (item) {
          return item.instanceName
        });

      this.conf.storeDatasource = scope.widget.datasource;
      this.conf.datasource = scope.widget.datasource;
      this.conf.instanceName = scope.widget.instanceName;
      this.conf.decoration = scope.widget.decoration || {};
      this.palettes = Palettes1;
      this.steps = [
        {
          title: "1.General Settings",
          disabled: false,
          active: true
        },
        {
          title: "2.Select Dataset",
          disabled: true,
          active: false
        },
        {
          title: "3.Select Data",
          disabled: true,
          active: false,
          wait: false
        },
        {
          title: "4.Show Data",
          disabled: true,
          active: false
        },
        {
          title: "5.Chart Settings",
          disabled: true,
          active: false
        }
      ];

      this.currentStep = this.steps[0];
      this.conf.url = "";
      this.provider = undefined;
      this.state = 0;
      this.restoreState(scope.widget.data, scope.provider)
    }

    RadarChartDialog.prototype = {


      styles: {
        "enable": {
          "background-color": "rgba(0, 149, 41, 0.31)",
          "border-radius": "20px"
        },
        "disable": {
          "background-color": "rgb(247, 219, 219)",
          "border-radius": "20px"
        },
        "active": {
          "background-color": "#008cba",
          "border-radius": "20px"
        },
        "selected": {
          "background-color": "#008cba",
          "color": "#ffffff"
        },
        "normal": {}
      },

      setColor: function (palette) {
        if (angular.isDefined(palette))
          this.conf.decoration.color = (this.inverseColor) ? this.inverse(palette) : palette;
      },

      inverseColor: function (palette) {
        if (angular.isDefined(palette))
          this.conf.decoration.color = this.inverse(palette);
      },

      inverse: function (palette) {
        var result = new Array();
        for (var i = 0; i < palette.length; i++) {
          result[i] = palette[palette.length - i - 1];
        }
        return result;
      },

      dataValue: function (arg) {
        if (!arg) return " - ";
        if (angular.isString(arg)) return arg;
        if (angular.isNumber(arg)) return arg.toFixed(2);
      },

      isNumber: function (arg) {
        return angular.isNumber(arg)
      },

      gotoStep: function (step) {
        if (this.currentStep) this.currentStep.active = false;

        this.currentStep = step;
        this.currentStep.active = true;

      },

      setEnabled: function (steps) {
        for (var i in steps)
          steps[i].disabled = false;
      },

      setDisabled: function (steps) {
        for (var i in steps)
          steps[i].disabled = true;
      },

      getItemStyle: function (dim, cat) {

        if (dim.selection.contains(cat)) {
          return this.styles["selected"]
        } else {
          return this.styles["normal"]
        }

      },

      getDatasetStyle: function (dataset) {
        if (this.conf.selectedDataset == dataset) {
          return {"background-color": "rgba(170, 200, 210, 0.43)"}
        } else {
          return {}
        }
      },


      restoreState: function (conf, provider) {

        if (conf && conf.standalone) {
          this.series = conf.series;
          this.conf.standalone = true;
          this.setDisabled(
            this.steps.filter(function (item, index) {
              return index > 0 && index < 4
            })
          );
          this.gotoStep(this.steps[4]);
          return;
        }


        this.conf.standalone = false;

        if (angular.isUndefined(provider)) {
          this.setState(0);
          return;
        }
        this.setState(1, provider);

        if (!conf) return;
        if (!conf.selectedDataset)return;

        this.setState(2, this.conf.metadata.find(
          function (item) {
            return item.id == conf.selectedDataset
          }
        ));

        for (var i in this.conf.selectedDataset.dimensions) {
          this.conf.selectedDataset.dimensions[i].selection.role = conf.selection[i].role;
          for (var j in conf.selection[i].collection) {
            this.selectCategory(
              this.conf.selectedDataset.dimensions[i],
              this.conf.selectedDataset.dimensions[i].categories.find(
                function (item) {
                  return item.id == conf.selection[i].collection[j].id
                })
            )
          }

        }

        if (!this.readyForDataFetch()) return;
        this.setState(3);

      },

      appendIfNotExist: function (subscription) {
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
          if (subscriptions[i].emitter == subscription.emitter
            && subscriptions[i].receiver == subscription.receiver
          ) return;
        }
        subscriptions.push(subscription);
      },

      removeIfExist: function (subscription) {
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
          if (subscriptions[i].emitter == subscription.emitter
            && subscriptions[i].receiver == subscription.receiver
          ) {
            subscriptions.splice(i, 1);
            return;
          }
        }

      },

      str: function (arg) {
        return (angular.isString(arg)) ? "'" + arg + "'" : arg;
      },

      setState: function () {
        switch (arguments[0]) {
          case 0://initial state
            this.state = 0;


            this.conf.url = "";
            this.setEnabled([this.steps[0]]);
            this.setDisabled(
              this.steps.filter(function (item, index) {
                return index > 0
              }));

            this.gotoStep(this.steps[0]);


            if (this.storedDatasource != this.conf.datasource) {
              var answer = new APIUser(this.scope).tryInvoke(this.conf.datasource, 'getDataProvider');
              //console.log(answer);
              if (answer.success && answer.result) {
                this.storedDatasource = this.conf.datasource;
                this.setState(1, answer.result);
              } else {
                this.storedDatasource = undefined;
              }
            }


            break;

          case 1: // set data provider
            this.state = 1;
            this.provider = arguments[1];
            this.conf.metadata = this.provider.getDatasets();
            this.conf.url = this.provider.getDataURL();

            this.setEnabled(
              this.steps.filter(function (item, index) {
                return index < 2
              })
            );

            this.setDisabled(
              this.steps.filter(function (item, index) {
                return index > 1
              })
            );

            this.gotoStep(this.steps[1]);

            break;

          case 2: // select dataset , dimension items selection in process

            if (arguments[1] && this.conf.selectedDataset != arguments[1]) {
              this.conf.selectedDataset = arguments[1];
              angular.forEach(this.conf.selectedDataset.dimensions, function (dim) {
                dim.selection = new KeySet();
              });

            }

            this.state = 2;

            //console.log("CONFIG",arguments[1],this.conf)
            this.setEnabled(
              this.steps.filter(function (item, index) {
                return index < 3
              })
            );

            this.setDisabled(
              this.steps.filter(function (item, index) {
                return index > 2
              })
            );
            this.gotoStep(this.steps[2]);
            break;

          case 3: // get data from dataset provider, fields role selection in process

            if (arguments[0] && this.state < arguments[0]) {
              this.conf.selection = [];
              for (var i in this.conf.selectedDataset.dimensions) {
                this.conf.selection.push(this.conf.selectedDataset.dimensions[i].selection);
              }
              this.table = TableGenerator.getData(this.conf, this.provider);
              this.series = BarSerieGenerator.getData(this.table);
              this.setState(4)
              //console.log("Series",this.series);
            }


            this.setEnabled(this.steps);

            this.gotoStep(this.steps[3]);

            break;

          case 4:
            this.state = 4;

            break;

          case 5: // Set widget data configuration


            if (this.scope.widget.instanceName != this.conf.instanceName) {
              this.removeIfExist({
                emitter: this.conf.datasource,
                receiver: this.scope.widget.instanceName,
                signal: "loadDataSuccess",
                slot: "setDataProvider"
              });
              this.scope.widget.instanceName = this.conf.instanceName;
            }

            if (!this.conf.standalone) {
              this.scope.widget.datasource = this.conf.datasource;
              this.appendIfNotExist({
                emitter: this.conf.datasource,
                receiver: this.conf.instanceName,
                signal: "loadDataSuccess",
                slot: "setDataProvider"
              });
            } else {
              this.scope.widget.datasource = undefined;
              this.removeIfExist({
                emitter: this.conf.datasource,
                receiver: this.conf.instanceName,
                signal: "loadDataSuccess",
                slot: "setDataProvider"
              });
            }

            //this.scope.s = pageSubscriptions();


            this.scope.widget.data = {
              "url": (this.conf.standalone) ? undefined : this.conf.url,
              "selectedDataset": (this.conf.standalone) ? undefined : this.conf.selectedDataset.id,
              "selection": (this.conf.standalone) ? undefined : this.conf.selection,
              "series": (this.conf.standalone) ? this.series : undefined,
              "standalone": this.conf.standalone
            }

            this.scope.widget.decoration = this.conf.decoration;


            //console.log("WIDGET CONF",this.scope.widget)

            this.modal.close();
            this.scope.APIUser.invoke(this.scope.widget.instanceName, APIProvider.RECONFIG_SLOT);
            //$scope.result = $scope.getData($scope.widget.data, $scope.provider);
            break;
        }
        //console.log("Dialog state ", this.state, this);
      },

      autoselect: function (dimension) {
        if (dimension.length > 1) return false;
        if (dimension.length == 1) {
          dimension.selection.add(dimension.categories[Object.keys(dimension.categories)[0]]);
          dimension.selection.role = "Fix Value"
          return true;
        }
      },


      selectCategory: function (dimension, category) {
        if (dimension.selection.role == "Fix Value") {
          dimension.selection.set([]);
          dimension.selection.add(category);
          return
        }
        if (!dimension.selection.contains(category)) {
          dimension.selection.add(category);
        } else {
          dimension.selection.remove(category);
        }
        this.setState(2)
      },

      selectAllCategories: function (dimension) {
        for (var cat in dimension.categories) {
          dimension.selection.add(dimension.categories[cat])
        }

        this.setState(2)
      },

      unselectAllCategories: function (dimension) {
        dimension.selection.set([]);
        this.setState(2)
      },

      readyForDataFetch: function () {
        var test = {
          rows: false,
          columns: false,
          allRole: true,
          allDimensionsSelected: true
        }

        if (this.conf.metadata && this.conf.selectedDataset) {

          var dims = this.conf.selectedDataset.dimensions;
          //console.log(dims)
          for (var i in dims) {
            test.rows |= dims[i].selection.role == "Rows";
            test.columns |= dims[i].selection.role == "Columns";
            test.allRole &= angular.isDefined(dims[i].selection.role);
            test.allDimensionsSelected &= dims[i].selection.length() > 0;
          }
        }

        return this.conf.metadata
          && this.conf.selectedDataset
          && test.rows
          && test.columns
          && test.allRole
          && test.allDimensionsSelected;
      },


      setDimensionRole: function (dimension, role) {
        var dims = this.conf.selectedDataset.dimensions;
        switch (role) {
          case "Fix Value":
            dimension.selection.role = "Fix Value";
            if (dimension.selection.length() > 0) {
              var cat = dimension.selection.collection[0];
              dimension.selection.set([]);
              dimension.selection.add(cat);
            }
            break;

          case "Rows":
            for (var i in dims) {
              if (dims[i].selection.role &&
                dims[i].selection.role == role) {
                dims[i].selection.role = undefined
              }
            }
            dimension.selection.role = role
            break

          case "Columns":
            for (var i in dims) {
              if (dims[i].selection.role &&
                dims[i].selection.role == role) {
                dims[i].selection.role = undefined
              }
            }
            dimension.selection.role = role
            break

          case "Split Columns":
            for (var i in dims) {
              if (dims[i].selection.role &&
                dims[i].selection.role == role) {
                dims[i].selection.role = undefined
              }
            }
            dimension.selection.role = role
            break
        }

        this.setState(2)
      },


      open: function () {
        //this.restoreState(this.scope.widget.data,this.scope.provider)
        var s = this.scope;
        $modal.open({
          templateUrl: 'widgets/data-dialogs/radar-chart-dialog.html',
          controller: 'RadarChartConfigDialog',
          backdrop: 'static',
          resolve: {
            widgetScope: function () {
              return s;
            }
          }
        }).result.then(function (newWidgetConfig) {
          });
      }
    }

    return RadarChartDialog;

  }]);

m.controller('RadarChartConfigDialog', function ($scope, $modalInstance, widgetScope) {
  $scope.dialog = widgetScope.dialog;
  widgetScope.dialog.modal = $modalInstance;

  $scope.ok = function () {
    $modalInstance.close(/*angular.extend(data, $scope.basicProperties)*/);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
});
