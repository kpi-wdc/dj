define(["angular",
    "widgets/data-util/keyset",
    "widgets/data-util/adapter",
    'angular-foundation',
    "widgets/data-dialogs/palettes1"
  ],
  function (angular) {
    var m = angular.module('app.widgets.data-dialogs.correlation-matrix-dialog', [
      'app.widgets.data-util.keyset',
      'app.widgets.data-util.adapter',
      'mm.foundation',
      'app.widgetApi',
      'app.widgets.palettes1'
    ]);

    m.factory("CorrelationMatrixDialog", ['KeySet', 'TableGenerator', 'CorrelationTableGenerator', '$modal',
      'APIUser', 'APIProvider', 'pageSubscriptions', 'pageWidgets',
      'Palettes1',

      function (KeySet, TableGenerator, CorrelationTableGenerator, $modal,
                APIUser, APIProvider, pageSubscriptions, pageWidgets,
                Palettes1) {

        var CorrelationMatrixDialog = function (scope) {

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
              title: "4.Table Settings",
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

        CorrelationMatrixDialog.prototype = {


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

          RGBA: function (hex, opacity) {
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
          },

          getCellBackground: function (row, col, value) {
            if (angular.isUndefined(value))return "transparent";
            if (this.conf.decoration.colorize == false) return "transparent";
            if (!this.conf.decoration.color) return "transparent";
            var range;
            switch (this.conf.decoration.colorizeMode) {
              case "Rows":
                range = this.conf.decoration.ranges.rows[row.label];
                break;
              case "Columns":
                col = Object.keys(row.values).sort(function (a, b) {
                  return (a < b) ? -1 : 1
                })[col];
                range = this.conf.decoration.ranges.columns[col];
                break;
              case "All Cells":
                range = this.conf.decoration.ranges.all;
                break;
            }
            if (!range)return "transparent";

            var index = Math.floor(((value - range.min) / (range.max - range.min)) * this.conf.decoration.color.length);//((range.max-range.min)/this.conf.decoration.color.length);
            index = (index == this.conf.decoration.color.length) ? index - 1 : index;
            //console.log("BG ",row,col,value,range,index);

            return this.RGBA(this.conf.decoration.color[index],
              ((this.conf.decoration.opacity) ? this.conf.decoration.opacity : 0.5));

          },

          getCellStyle: function (row, col, value) {
            if (arguments.length < 3)
              return {"background": "transparent"};
            return {"background": this.getCellBackground(row, col, value)}
          },

          calculateRanges: function () {
            var ranges = {};
            ranges.rows = {};

            for (var i in this.table.body) {
              ranges.rows[this.table.body[i].label] = {
                max: 1,
                min: -1
              }
            }
            ranges.columns = {};
            for (var i in this.table.header.body) {
              ranges.columns[this.table.header.body[i].label] = {
                max: 1,
                min: -1
              }
            }

            ranges.all = {
              max: 1,
              min: -1
            }

            return ranges;

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
              this.table = conf.table;
              this.conf.standalone = true;
              this.setDisabled(
                this.steps.filter(function (item, index) {
                  return index > 0 && index < 4
                })
              );
              this.gotoStep(this.steps[3]);
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
            if (this.table) {
              this.table.header = conf.header;
              this.setState(4);
              this.gotoStep(this.steps[3])
            }

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

          readyForSerieGeneration: function () {
            var result;
            if (this.table.header.coordX) return true;
            for (var i in this.table.header.body) {
              if (this.table.header.body[i].coordX) return true;
            }
            return false;
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
                  this.table = CorrelationTableGenerator.getData(this.table);
                  //console.log(this.table)

                  this.setEnabled(this.steps);
                  this.setState(4)
                  this.gotoStep(this.steps[3]);

                  //this.series = BarSerieGenerator.getData(this.table);

                }

                break;

              case 4:

                this.state = 4;
                this.conf.decoration.ranges = this.calculateRanges();
                break;


              case 5: // Set widget data configuration
                //this.series = ScatterSerieGenerator.getData(this.table);

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

                  //generate series


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
                  "header": (this.conf.standalone) ? undefined : this.table.header,
                  "selectedDataset": (this.conf.standalone) ? undefined : this.conf.selectedDataset.id,
                  "selection": (this.conf.standalone) ? undefined : this.conf.selection,
                  "table": (this.conf.standalone) ? this.table : undefined,
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
              templateUrl: 'widgets/data-dialogs/correlation-matrix-dialog.html',
              controller: 'CorrelationMatrixConfigDialog',
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

        return CorrelationMatrixDialog;

      }]);


    m.controller('CorrelationMatrixConfigDialog', function ($scope, $modalInstance, widgetScope) {
      $scope.dialog = widgetScope.dialog;
      widgetScope.dialog.modal = $modalInstance;

      $scope.ok = function () {
        $modalInstance.close(/*angular.extend(data, $scope.basicProperties)*/);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };
    });

  })


//define(["angular","widgets/data-util/keyset", "/widgets/data-util/table-adapter",'angular-foundation'],
//    function (angular) {
//        var m = angular.module('app.widgets.data-dialogs.data-table-dialog', [
//            'app.widgets.data-util.keyset',
//            'app.widgets.data-util.table-adapter',
//            'mm.foundation',
//            'app.widgetApi'
//        ]);
//
//        m.factory("DataTableDialog", ['KeySet','$modal','APIUser','APIProvider','pageSubscriptions','TableAdapter',
//
//            function(KeySet,$modal,APIUser,APIProvider,pageSubscriptions,TableAdapter) {
//
//                var DataTableDialog = function(scope){
//
//                this.scope = scope;
//                this.storeDatasource = scope.widget.datasource;
//                this.datasource = scope.widget.datasource;
//                this.instanceName = scope.widget.instanceName;
//                this.decoration = scope.widget.decoration || {};
//
//                this.step=[];
//                for(var i=0;i<7;i++) this.step.push({access:"enable",active:false});
//                this.currentStep= 0;
//
//                this.selection= {
//                    dataset: undefined,
//                        result: undefined,
//                        series: undefined,
//                        role: {},
//                    fields: {}
//                };
//
//                this.url= "";
//                this.provider= undefined;
//                this.dimensionList = [];
//
//
//                this.state = 0;
//
//                this.restoreState(scope.widget.data,scope.provider)
//            }
//
//                DataTableDialog.prototype =  {
//
//
//                styles:{
//                    "enable":{
//                        "background-color":"rgba(0, 149, 41, 0.31)",
//                        "border-radius":"20px"
//                    },
//                    "disable":{
//                        "background-color":"rgb(247, 219, 219)",
//                        "border-radius":"20px"
//                    },
//                    "active":{
//                        "background-color":"#008cba",
//                        "border-radius":"20px"
//                    }
//                },
//
//                setColor: function(palette){
//                  if(angular.isDefined(palette))
//                  this.decoration.color = (this.inverseColor)?this.inverse(palette):palette;
//                },
//
//                inverseColor: function(palette){
//                    if(angular.isDefined(palette))
//                        this.decoration.color = this.inverse(palette);
//                },
//
//                inverse : function(palette){
//                    var result = new Array();
//                    for(var i=0;i<palette.length;i++){
//                        result[i] = palette[palette.length-i-1];
//                    }
//                    return result;
//                },
//
//                changeHeader:function(index,t){
//                    this.theader[index] = t;
//                },
//
//                gotoStep: function(index){
//                    //for(var i in this.step)this.step=false;
//                    this.step[index].active = true;
//                    this.currentStep = index;
//                },
//
//                tryGotoStep: function(index){
//                  if(this.step[index].access == "enable") {
//                      return;
//                  }
//                    this.gotoStep(this.currentStep);
//                },
//
//                setEnable: function(steps){
//                    for(var i in steps)
//                    this.step[steps[i]].access = "enable";
//                },
//                setDisable: function(steps){
//                    for(var i in steps)
//                    this.step[steps[i]].access = "disable";
//                },
//
//                getStyle:function(index){
//                    if(this.step[index].active){
//                        return this.styles["active"];
//                    }
//                    return this.styles[this.step[index].access];
//                },
//
//
//
//                restoreState: function (conf, provider) {
//
//                    if(conf && conf.standalone){
//                        this.selection.series = conf.series;
//                        this.selection.standalone = true;
//                        this.setDisable([1,2,3,4]);
//                        this.gotoStep(6);
//                        return;
//                    }
//
//
//                    this.selection.standalone = false;
//
//                    if(angular.isUndefined(provider)){
//                        this.setState(0);
//                        return;
//                    }
//                    this.setState(1, provider);
//                    if (!conf) return;
//                    if (!conf.dataset)return;
//                    this.setState(2, conf.dataset);
//                    if (!conf.dimensions)return;
//                    for (var i in conf.dimensions) {
//                        this.selection.dimensions[i].set(conf.dimensions[i].collection)
//                    }
//
//                    if (!this.readyForDataFetch()) return;
//                    this.setState(3);
//
//                    this.selection.role = conf.role;
//
//                    for (var i in this.selection.fields) {
//                        this.selection.fields[i] = "Not Used";
//                    }
//                    if (angular.isDefined(this.selection.role["Serie"])) {
//                        this.selection.fields[this.selection.role["Serie"]] = "Serie";
//                    }
//                    if (angular.isDefined(this.selection.role["Label"])) {
//                        this.selection.fields[this.selection.role["Label"]] = "Label";
//                    }
//                    if (angular.isDefined(this.selection.role["Value"])) {
//                        this.selection.fields[this.selection.role["Value"]] = "Value";
//                    }
//                    this.selection.itemsOrder = conf.itemsOrder;
//                    this.selection.seriesOrder = conf.seriesOrder;
//
//                    if (!this.readyForSeriesGeneration) return;
//
//                    this.setState(4);
//
//                    this.selection.standalone = conf.standalone;
//                },
//
//                appendIfNotExist: function(subscription){
//                    var subscriptions = pageSubscriptions();
//                    for(var i in subscriptions){
//                        if(subscriptions[i].emitter == subscription.emitter
//                        && subscriptions[i].receiver == subscription.receiver
//                        ) return;
//                    }
//                    subscriptions.push(subscription);
//                },
//
//                removeIfExist: function(subscription){
//                    var subscriptions = pageSubscriptions();
//                    for(var i in subscriptions){
//                        if(subscriptions[i].emitter == subscription.emitter
//                            && subscriptions[i].receiver == subscription.receiver
//                        ){
//                            subscriptions.splice(i,1);
//                            return;
//                        }
//                    }
//
//                },
//
//                setState: function () {
//                    switch (arguments[0]) {
//                        case 0://initial state
//                            this.state = 0;
//
//
//                            this.url = "";
//                            this.dimensionList = [];
//                            this.selection = {
//                                dataset: undefined,
//                                result: undefined,
//                                queries: undefined,
//                                series: undefined,
//                                dimensions: undefined,
//                                role: {},
//                                fields: {}
//                            };
//                            this.setEnable([0]);
//                            this.setDisable([1,2,3,4,5,6]);
//                            this.gotoStep(0);
//
//
//                            if(this.storedDatasource != this.datasource){
//                               var answer = new APIUser(this.scope).tryInvoke(this.datasource,'getDataProvider');
//                                console.log(answer);
//                               if(answer.success && answer.result){
//                                   this.storedDatasource = this.datasource;
//                                   this.setState(1,answer.result);
//                               }else{
//                                   this.storedDatasource = undefined;
//                               }
//                            }
//
//
//
//                            break;
//
//                        case 1: // set data provider
//                            this.state = 1;
//                            this.provider = arguments[1]
//                            this.url = this.provider.getDataURL();
//                            this.datasetList = this.provider.getDatasetIdList();
//                            this.selection.dataset = undefined;
//                            this.selection.result = undefined;
//                            this.selection.series = undefined;
//                            this.selection.queries = undefined;
//                            this.selection.role = undefined;
//                            this.selection.fields = undefined;
//                            this.selection.dimensions = undefined;
//
//                            this.setEnable([0,1]);
//                            this.setDisable([2,3,4,5,6]);
//                            this.gotoStep(1);
//
//                            break;
//
//                        case 2: // select dataset , dimension items selection in process
//                            if (arguments[1] && this.selection.dataset != arguments[1]) {
//                                this.selection.dataset = arguments[1];
//                                var dimensions = {};
//
//                                var dims = this.provider.getDimensionList(this.selection.dataset);
//                                angular.forEach(dims, function (dim) {
//                                    dimensions[dim] = new KeySet();
//                                });
//                                this.selection.dimensions = dimensions;
//                            }
//                            this.state = 2;
//                            this.selection.result = undefined;
//                            this.selection.series = undefined;
//                            this.selection.queries = undefined;
//                            //this.header = [];
//
//                            this.setEnable([0,1,2]);
//                            this.setDisable([3,4,5,6]);
//                            this.gotoStep(2);
//                            break;
//
//                        case 3: // get data from dataset provider, fields role selection in process
//                            if (arguments[0] && this.state < arguments[0]) {
//                                this.selection.fields = {};
//                                //this.header = [];
//                                this.selection.role = {
//                                    Serie: undefined,
//                                    Label: undefined,
//                                    Value: undefined
//                                };
//                                this.selection.result = this.provider.getData(this.selection.dataset, this.selection.dimensions);
//                                for (var i in this.selection.result.header) {
//                                    this.selection.fields[this.selection.result.header[i]] = "Not Used";
//                                }
//                            }
//
//                            this.selection.series = undefined;
//                            this.selection.queries = undefined;
//                            this.state = 3;
//
//                            this.setEnable([0,1,2,3,4]);
//                            this.setDisable([5,6]);
//                            this.gotoStep(4);
//
//                            break;
//
//                        case 4: // generate series
//                            this.selection.queries = [];
//                            this.theader = [];
//                            var queryStr = "", itemsCriteria = "", order = "";
//                            var tmpResult = this.selection.result.data;
//
//                            switch (this.selection.itemsOrder) {
//                                case "Label (A-Z)":
//                                    itemsCriteria = this.selection.role.Label;
//                                    break;
//                                case "Label (Z-A)":
//                                    itemsCriteria = this.selection.role.Label;
//                                    order = "descending";
//                                    break;
//                                case "Value (A-Z)":
//                                    itemsCriteria = this.selection.role.Value;
//                                    break;
//                                case "Value (Z-A)":
//                                    itemsCriteria = this.selection.role.Value;
//                                    order = "descending";
//                                    break;
//                            }
//                            if (itemsCriteria != "") {
//                                queryStr = "from r in $0 orderby r." + itemsCriteria + " " + order + " select r";
//                                this.selection.queries.push(queryStr);
//                                var query = new jsinq.Query(queryStr);
//                                query.setValue(0, new jsinq.Enumerable(tmpResult));
//                                tmpResult = query.execute().toArray();
//                            }
//
//                            queryStr = "from r " +
//                            "in $0 " +
//                            "group " +
//                            "{label: r." + this.selection.role.Label + ", value: r." + this.selection.role.Value + "}" +
//                            " by r." + this.selection.role.Serie +
//                            " into d select {key:d.key, values:d.toArray()}";
//                            this.selection.queries.push(queryStr);
//                            var query = new jsinq.Query(queryStr);
//                            query.setValue(0, new jsinq.Enumerable(tmpResult));
//                            tmpResult = query.execute().toArray();
//
//                            if (this.selection.seriesOrder == "Z-A") {
//                                queryStr = "from r in $0 orderby r.key descending select r";
//                                this.selection.queries.push(queryStr);
//                                var query = new jsinq.Query(queryStr);
//                                query.setValue(0, new jsinq.Enumerable(tmpResult));
//                                tmpResult = query.execute().toArray();
//                            }
//
//                            this.selection.series = tmpResult;
//                            this.table = TableAdapter.getData(tmpResult);
//                            if(!this.decoration.header)
//                                for(var i in this.table[0].values){
//                                    this.decoration.header.push(this.table[0].values[i].label)
//                                }
//
//
//                            this.state = 4;
//
//                            this.setEnable([0,1,2,3,4,5,6]);
//                            //this.setDisable([5,6]);
//                            this.gotoStep(6);
//
//                            break;
//
//                        case 5: // Set widget data configuration
//                            if(!this.selection.standalone){
//                                this.scope.widget.datasource = this.datasource;
//                                this.appendIfNotExist({
//                                    emitter: this.datasource,
//                                    receiver: this.instanceName,
//                                    signal: "loadDataSuccess",
//                                    slot: "setDataProvider"
//                                });
//                            }else{
//                                this.scope.widget.datasource = undefined;
//                                this.removeIfExist({
//                                    emitter: this.datasource,
//                                    receiver: this.instanceName,
//                                    signal: "loadDataSuccess",
//                                    slot: "setDataProvider"
//                                });
//                            }
//
//                            this.scope.s = pageSubscriptions();
//
//
//
//                            this.scope.widget.data = {
//                                "url": (this.selection.standalone) ? undefined : this.url,
//                                "dataset": (this.selection.standalone) ? undefined : this.selection.dataset,
//                                "dimensions": (this.selection.standalone) ? undefined : this.selection.dimensions,
//                                "role": (this.selection.standalone) ? undefined : this.selection.role,
//                                "queries": (this.selection.standalone) ? undefined : this.selection.queries,
//                                "series": (this.selection.standalone) ? this.selection.series : undefined,
//                                "itemsOrder": (this.selection.standalone) ? undefined : this.selection.itemsOrder,
//                                "seriesOrder": (this.selection.standalone) ? undefined : this.selection.seriesOrder,
//                                "standalone": this.selection.standalone
//                            }
//
//                            this.scope.widget.decoration = this.decoration;
//
//                            this.modal.close();
//                            (new APIUser).invokeAll(APIProvider.RECONFIG_SLOT);
//                            //$scope.result = $scope.getData($scope.widget.data, $scope.provider);
//                            break;
//                    }
//                    //console.log("Dialog state ", this.state, this);
//                },
//
//                autoselect: function(dataset, dimension){
//                    var ids = this.provider.getDimensionIdList(dataset, dimension);
//                    if (ids.length > 1) return false;
//                    if (ids.length == 1) {
//                        this.selection.dimensions[dimension].add(ids[0]);
//                        return true;
//                    }
//                },
//
//                getDatasetStyle: function (dataset) {
//                    if (this.selection.dataset == dataset) {
//                        return {"background-color": "rgba(170, 200, 210, 0.43)"}
//                    } else {
//                        return {}
//                    }
//                },
//
//                getFieldStyle: function (field) {
//                    if (this.selection.fields[field] == "Not Used") {
//                        return {"font-weight": "normal"}
//                    } else {
//                        return {"font-weight": "bold", "background-color": "rgb(170, 200, 210)"}
//                    }
//                },
//
//                selectCategory: function (dimension, category) {
//                    if (!this.selection.dimensions[dimension].contains(category)) {
//                        this.selection.dimensions[dimension].add(category);
//                    } else {
//                        this.selection.dimensions[dimension].remove(category);
//                    }
//                    this.setState(2)
//                },
//
//                selectAllCategories: function (dimension) {
//                    var cats = this.provider.getDimensionIdList(this.selection.dataset, dimension);
//                    this.selection.dimensions[dimension].set(cats);
//                    this.setState(2)
//                },
//
//                unselectAllCategories: function (dimension) {
//                    this.selection.dimensions[dimension].set([]);
//                    this.setState(2)
//                },
//
//                readyForDataFetch: function () {
//                    for (var i in this.selection.dimensions)
//                        if (this.selection.dimensions[i].length() == 0){
//                            this.setDisable([3,4,5,6]);
//                            return false;
//                        }
//                    return true;
//                },
//
//                changeFieldRole: function (field) {
//                    this.setState(3);
//
//                    var newRole = this.selection.fields[field];
//
//                    for (var i in this.selection.fields) {
//                        this.selection.fields[i] = "Not Used";
//                    }
//
//                    if (this.selection.role["Serie"] == field) this.selection.role["Serie"] = undefined;
//                    if (this.selection.role["Label"] == field) this.selection.role["Label"] = undefined;
//                    if (this.selection.role["Value"] == field) this.selection.role["Value"] = undefined;
//
//                    if (newRole != "Not Used") {
//                        this.selection.role[newRole] = field;
//                    }
//
//                    if (angular.isDefined(this.selection.role["Serie"])) {
//                        this.selection.fields[this.selection.role["Serie"]] = "Serie";
//                    }
//                    if (angular.isDefined(this.selection.role["Label"])) {
//                        this.selection.fields[this.selection.role["Label"]] = "Label";
//                    }
//                    if (angular.isDefined(this.selection.role["Value"])) {
//                        this.selection.fields[this.selection.role["Value"]] = "Value";
//                    }
//                },
//
//                readyForSeriesGeneration: function () {
//                    if (angular.isDefined(this.selection.role["Serie"]) &&
//                        angular.isDefined(this.selection.role["Label"]) &&
//                        angular.isDefined(this.selection.role["Value"])) {
//                        return true
//                    } else {
//                        this.setDisable([5,6]);
//                        return false
//                    }
//                },
//
//                open: function(){
//                    //this.restoreState(this.scope.widget.data,this.scope.provider)
//                    var s = this.scope;
//                    $modal.open({
//                        templateUrl: 'widgets/data-dialogs/data-table-dialog.html',
//                        controller: 'DataTableConfigDialog',
//                        backdrop: 'static',
//                        resolve: {
//                            widgetScope: function () {
//                                return s;
//                            }
//                        }
//                    }).result.then(function (newWidgetConfig) {
//                    });
//                }
//            }
//
//            return DataTableDialog;
//
//        }]);
//
//        m.controller('DataTableConfigDialog', function ($scope, $modalInstance, widgetScope) {
//            $scope.dialog = widgetScope.dialog;
//            widgetScope.dialog.modal = $modalInstance;
//
//            $scope.ok = function () {
//                $modalInstance.close(/*angular.extend(data, $scope.basicProperties)*/);
//            };
//
//            $scope.cancel = function () {
//                $modalInstance.dismiss();
//            };
//        });
//
//    })
