define(["angular",
        "/widgets/data-util/keyset.js",
        'angular-foundation',
        "/widgets/data-dialogs/wizard-state-mashine/wizard-state-mashine.js"
    ],

    function (angular) {
        var m = angular.module('app.widgets.data-dialogs.bar-chart-dialog', [
            'app.widgets.data-util.keyset',
            'app.widgets.data-dialogs.wizard-state-machine',
            'mm.foundation',
            'app.widgetApi',
            'app.widgets.palettes1'
        ]);

        m.factory("BarChartDialog", ['KeySet','WSM','$modal','APIUser','APIProvider','pageSubscriptions','Palettes1',

            function(KeySet, WSM, $modal, APIUser, APIProvider, pageSubscriptions, Palettes1) {

            var BarChartDialog = function(scope){

                this.wsm = new WSM(this,{
                   states:{
                       "initial":{
                           initial:true,
                           onSetState: function(wsm){
                               wsm.context = wsm.scope.scope.widget;
                               wsm.setState("generalSettings");

                           }
                       },
                       "generalSettings":{
                           enabled: function(scope){return !scope.configuration.standalone},
                           accept: function(wsm, signal, fromState){
                               switch (signal){

                                   case "setDataSource":
                                       // Usage: ng-model="dialog...datasource" ng-blur="dialog.wsm.fire('setDatasource',datasource)"
                                       //TODO get datasource from arguments
                                       if( wsm.context.datasource != datasource){
                                            //TODO getDataProvider if exist and replace subscriptions
                                           wsm.scope.datasource = wsm.context.datasource = datasource ;
                                           wsm.fire("SetDataProvider", wsm.context.dataProvider);
                                           if(wsm.enableNext())wsm.next();
                                       }
                                       break;

                                   case "setInstanceName":
                                       //TODO replace subscriptions if exist
                                       break;

                                   case "next":
                                       setState("datasetSettings");
                                       break;
                               }
                           }
                       }
                   }
                });




                this.scope = scope;
                this.storeDatasource = scope.widget.datasource;
                this.datasource = scope.widget.datasource;
                this.instanceName = scope.widget.instanceName;
                this.decoration = scope.widget.decoration || {};
                this.palettes = Palettes1;
                this.step=[];
                for(var i=0;i<7;i++) this.step.push({access:"enable",active:false});
                this.currentStep= 0;

                this.selection= {
                    dataset: undefined,
                        result: undefined,
                        series: undefined,
                        role: {},
                    fields: {}
                };

                this.url= "";
                this.provider= undefined;
                this.dimensionList = [];

                this.state = 0;

                this.restoreState(scope.widget.data,scope.provider)
            }

            BarChartDialog.prototype =  {


                styles:{
                    "enable":{
                        "background-color":"rgba(0, 149, 41, 0.31)",
                        "border-radius":"20px"
                    },
                    "disable":{
                        "background-color":"rgb(247, 219, 219)",
                        "border-radius":"20px"
                    },
                    "active":{
                        "background-color":"#008cba",
                        "border-radius":"20px"
                    }
                },

                setColor: function(palette){
                  if(angular.isDefined(palette))
                  this.decoration.color = (this.inverseColor)?this.inverse(palette):palette;
                },

                inverseColor: function(palette){
                    if(angular.isDefined(palette))
                        this.decoration.color = this.inverse(palette);
                },

                inverse : function(palette){
                    var result = new Array();
                    for(var i=0;i<palette.length;i++){
                        result[i] = palette[palette.length-i-1];
                    }
                    return result;
                },

                gotoStep: function(index){
                    //for (var i in this.step)this.step=false;
                    this.step[index].active = true;
                    this.currentStep = index;
                },

                tryGotoStep: function(index){
                  if(this.step[index].access == "enable") {
                      return;
                  }
                    this.gotoStep(this.currentStep);
                },

                setEnable: function(steps){
                    for(var i in steps)
                    this.step[steps[i]].access = "enable";
                },
                setDisable: function(steps){
                    for(var i in steps)
                    this.step[steps[i]].access = "disable";
                },

                getStyle:function(index){
                    if(this.step[index].active){
                        return this.styles["active"];
                    }
                    return this.styles[this.step[index].access];
                },



                restoreState: function (conf, provider) {

                    if(conf && conf.standalone){
                        this.selection.series = conf.series;
                        this.selection.standalone = true;
                        this.setDisable([1,2,3,4]);
                        this.gotoStep(6);
                        return;
                    }


                    this.selection.standalone = false;

                    if(angular.isUndefined(provider)){
                        this.setState(0);
                        return;
                    }
                    this.setState(1, provider);
                    if (!conf) return;
                    if (!conf.dataset)return;
                    this.setState(2, conf.dataset);
                    if (!conf.dimensions)return;
                    for (var i in conf.dimensions) {
                        this.selection.dimensions[i].set(conf.dimensions[i].collection)
                    }

                    if (!this.readyForDataFetch()) return;
                    this.setState(3);

                    this.selection.role = conf.role;

                    for (var i in this.selection.fields) {
                        this.selection.fields[i] = "Not Used";
                    }
                    if (angular.isDefined(this.selection.role["Serie"])) {
                        this.selection.fields[this.selection.role["Serie"]] = "Serie";
                    }
                    if (angular.isDefined(this.selection.role["Label"])) {
                        this.selection.fields[this.selection.role["Label"]] = "Label";
                    }
                    if (angular.isDefined(this.selection.role["Value"])) {
                        this.selection.fields[this.selection.role["Value"]] = "Value";
                    }
                    this.selection.itemsOrder = conf.itemsOrder;
                    this.selection.seriesOrder = conf.seriesOrder;

                    if (!this.readyForSeriesGeneration) return;

                    this.setState(4);

                    this.selection.standalone = conf.standalone;
                },

                appendIfNotExist: function(subscription){
                    var subscriptions = pageSubscriptions();
                    for(var i in subscriptions){
                        if(subscriptions[i].emitter == subscription.emitter
                        && subscriptions[i].receiver == subscription.receiver
                        ) return;
                    }
                    subscriptions.push(subscription);
                },

                removeIfExist: function(subscription){
                    var subscriptions = pageSubscriptions();
                    for(var i in subscriptions){
                        if(subscriptions[i].emitter == subscription.emitter
                            && subscriptions[i].receiver == subscription.receiver
                        ){
                            subscriptions.splice(i,1);
                            return;
                        }
                    }

                },

                setState: function () {
                    switch (arguments[0]) {
                        case 0://initial state
                            this.state = 0;


                            this.url = "";
                            this.dimensionList = [];
                            this.selection = {
                                dataset: undefined,
                                result: undefined,
                                queries: undefined,
                                series: undefined,
                                dimensions: undefined,
                                role: {},
                                fields: {}
                            };
                            this.setEnable([0]);
                            this.setDisable([1,2,3,4,5,6]);
                            this.gotoStep(0);


                            if(this.storedDatasource != this.datasource){
                               var answer = new APIUser(this.scope).tryInvoke(this.datasource,'getDataProvider');
                                console.log(answer);
                               if(answer.success && answer.result){
                                   this.storedDatasource = this.datasource;
                                   this.setState(1,answer.result);
                               }else{
                                   this.storedDatasource = undefined;
                               }
                            }



                            break;

                        case 1: // set data provider
                            this.state = 1;
                            this.provider = arguments[1]
                            this.url = this.provider.getDataURL();
                            this.datasetList = this.provider.getDatasetIdList();
                            this.selection.dataset = undefined;
                            this.selection.result = undefined;
                            this.selection.series = undefined;
                            this.selection.queries = undefined;
                            this.selection.role = undefined;
                            this.selection.fields = undefined;
                            this.selection.dimensions = undefined;

                            this.setEnable([0,1]);
                            this.setDisable([2,3,4,5,6]);
                            this.gotoStep(1);

                            break;

                        case 2: // select dataset , dimension items selection in process
                            if (arguments[1] && this.selection.dataset != arguments[1]) {
                                this.selection.dataset = arguments[1];
                                var dimensions = {};
                                var dims = this.provider.getDimensionList(this.selection.dataset);
                                angular.forEach(dims, function (dim) {
                                    dimensions[dim] = new KeySet();
                                });
                                this.selection.dimensions = dimensions;
                            }
                            this.state = 2;
                            this.selection.result = undefined;
                            this.selection.series = undefined;
                            this.selection.queries = undefined;

                            this.setEnable([0,1,2]);
                            this.setDisable([3,4,5,6]);
                            this.gotoStep(2);
                            break;

                        case 3: // get data from dataset provider, fields role selection in process
                            if (arguments[0] && this.state < arguments[0]) {
                                this.selection.fields = {};
                                this.selection.role = {
                                    Serie: undefined,
                                    Label: undefined,
                                    Value: undefined
                                };
                                this.selection.result = this.provider.getData(this.selection.dataset, this.selection.dimensions);
                                for (var i in this.selection.result.header) {
                                    this.selection.fields[this.selection.result.header[i]] = "Not Used";
                                }
                            }

                            this.selection.series = undefined;
                            this.selection.queries = undefined;
                            this.state = 3;

                            this.setEnable([0,1,2,3,4]);
                            this.setDisable([5,6]);
                            this.gotoStep(4);

                            break;

                        case 4: // generate series
                            this.selection.queries = [];
                            var queryStr = "", itemsCriteria = "", order = "";
                            var tmpResult = this.selection.result.data;

                            switch (this.selection.itemsOrder) {
                                case "Label (A-Z)":
                                    itemsCriteria = this.selection.role.Label;
                                    break;
                                case "Label (Z-A)":
                                    itemsCriteria = this.selection.role.Label;
                                    order = "descending";
                                    break;
                                case "Value (A-Z)":
                                    itemsCriteria = this.selection.role.Value;
                                    break;
                                case "Value (Z-A)":
                                    itemsCriteria = this.selection.role.Value;
                                    order = "descending";
                                    break;
                            }
                            if (itemsCriteria != "") {
                                queryStr = "from r in $0 orderby r." + itemsCriteria + " " + order + " select r";
                                this.selection.queries.push(queryStr);
                                var query = new jsinq.Query(queryStr);
                                query.setValue(0, new jsinq.Enumerable(tmpResult));
                                tmpResult = query.execute().toArray();
                            }

                            queryStr = "from r " +
                            "in $0 " +
                            "group " +
                            "{label: r." + this.selection.role.Label + ", value: r." + this.selection.role.Value + "}" +
                            " by r." + this.selection.role.Serie +
                            " into d select {key:d.key, values:d.toArray()}";
                            this.selection.queries.push(queryStr);
                            var query = new jsinq.Query(queryStr);
                            query.setValue(0, new jsinq.Enumerable(tmpResult));
                            tmpResult = query.execute().toArray();

                            if (this.selection.seriesOrder == "Z-A") {
                                queryStr = "from r in $0 orderby r.key descending select r";
                                this.selection.queries.push(queryStr);
                                var query = new jsinq.Query(queryStr);
                                query.setValue(0, new jsinq.Enumerable(tmpResult));
                                tmpResult = query.execute().toArray();
                            }

                            this.selection.series = tmpResult;
                            this.state = 4;

                            this.setEnable([0,1,2,3,4,5,6]);
                            //this.setDisable([5,6]);
                            this.gotoStep(6);

                            break;

                        case 5: // Set widget data configuration
                            if(!this.selection.standalone){
                                this.scope.widget.datasource = this.datasource;
                                this.appendIfNotExist({
                                    emitter: this.datasource,
                                    receiver: this.instanceName,
                                    signal: "loadDataSuccess",
                                    slot: "setDataProvider"
                                });
                            }else{
                                this.scope.widget.datasource = undefined;
                                this.removeIfExist({
                                    emitter: this.datasource,
                                    receiver: this.instanceName,
                                    signal: "loadDataSuccess",
                                    slot: "setDataProvider"
                                });
                            }

                            this.scope.s = pageSubscriptions();



                            this.scope.widget.data = {
                                "url": (this.selection.standalone) ? undefined : this.url,
                                "dataset": (this.selection.standalone) ? undefined : this.selection.dataset,
                                "dimensions": (this.selection.standalone) ? undefined : this.selection.dimensions,
                                "role": (this.selection.standalone) ? undefined : this.selection.role,
                                "queries": (this.selection.standalone) ? undefined : this.selection.queries,
                                "series": (this.selection.standalone) ? this.selection.series : undefined,
                                "itemsOrder": (this.selection.standalone) ? undefined : this.selection.itemsOrder,
                                "seriesOrder": (this.selection.standalone) ? undefined : this.selection.seriesOrder,
                                "standalone": this.selection.standalone
                            }

                            this.scope.widget.decoration = this.decoration;

                            this.modal.close();
                            (new APIUser).invoke(this.scope.widget.instanceName,APIProvider.RECONFIG_SLOT);
                            //$scope.result = $scope.getData($scope.widget.data, $scope.provider);
                            break;
                    }
                    //console.log("Dialog state ", this.state, this);
                },

                autoselect: function(dataset, dimension){
                    var ids = this.provider.getDimensionIdList(dataset, dimension);
                    if (ids.length > 1) return false;
                    if (ids.length == 1) {
                        this.selection.dimensions[dimension].add(ids[0]);
                        return true;
                    }
                },

                getDatasetStyle: function (dataset) {
                    if (this.selection.dataset == dataset) {
                        return {"background-color": "rgba(170, 200, 210, 0.43)"}
                    } else {
                        return {}
                    }
                },

                getFieldStyle: function (field) {
                    if (this.selection.fields[field] == "Not Used") {
                        return {"font-weight": "normal"}
                    } else {
                        return {"font-weight": "bold", "background-color": "rgb(170, 200, 210)"}
                    }
                },

                selectCategory: function (dimension, category) {
                    if (!this.selection.dimensions[dimension].contains(category)) {
                        this.selection.dimensions[dimension].add(category);
                    } else {
                        this.selection.dimensions[dimension].remove(category);
                    }
                    this.setState(2)
                },

                selectAllCategories: function (dimension) {
                    var cats = this.provider.getDimensionIdList(this.selection.dataset, dimension);
                    this.selection.dimensions[dimension].set(cats);
                    this.setState(2)
                },

                unselectAllCategories: function (dimension) {
                    this.selection.dimensions[dimension].set([]);
                    this.setState(2)
                },

                readyForDataFetch: function () {
                    for (var i in this.selection.dimensions)
                        if (this.selection.dimensions[i].length() == 0){
                            this.setDisable([3,4,5,6]);
                            return false;
                        }
                    return true;
                },

                changeFieldRole: function (field) {
                    this.setState(3);

                    var newRole = this.selection.fields[field];

                    for (var i in this.selection.fields) {
                        this.selection.fields[i] = "Not Used";
                    }

                    if (this.selection.role["Serie"] == field) this.selection.role["Serie"] = undefined;
                    if (this.selection.role["Label"] == field) this.selection.role["Label"] = undefined;
                    if (this.selection.role["Value"] == field) this.selection.role["Value"] = undefined;

                    if (newRole != "Not Used") {
                        this.selection.role[newRole] = field;
                    }

                    if (angular.isDefined(this.selection.role["Serie"])) {
                        this.selection.fields[this.selection.role["Serie"]] = "Serie";
                    }
                    if (angular.isDefined(this.selection.role["Label"])) {
                        this.selection.fields[this.selection.role["Label"]] = "Label";
                    }
                    if (angular.isDefined(this.selection.role["Value"])) {
                        this.selection.fields[this.selection.role["Value"]] = "Value";
                    }
                },

                readyForSeriesGeneration: function () {
                    if (angular.isDefined(this.selection.role["Serie"]) &&
                        angular.isDefined(this.selection.role["Label"]) &&
                        angular.isDefined(this.selection.role["Value"])) {
                        return true
                    } else {
                        this.setDisable([5,6]);
                        return false
                    }
                },

                open: function(){
                    //this.restoreState(this.scope.widget.data,this.scope.provider)
                    var s = this.scope;
                    $modal.open({
                        templateUrl: 'widgets/data-dialogs/bar-chart-dialog.html',
                        controller: 'BarChartConfigDialog',
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

            return BarChartDialog;

        }]);

        m.controller('BarChartConfigDialog', function ($scope, $modalInstance, widgetScope) {
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