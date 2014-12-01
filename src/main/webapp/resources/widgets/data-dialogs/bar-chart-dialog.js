define(["angular","/widgets/data-util/keyset.js"],
    function (angular) {
        var m = angular.module('app.widgets.data-dialogs.bar-chart-dialog', ['app.widgets.data-util.keyset']);

        m.factory("BarChartDialog", ['KeySet', function(KeySet) {

            BarChartDialog = function(scope){
                this.scope = scope;
            }

            BarChartDialog.prototype =  {

                url: "",//$scope.widget.data.url,

                provider: undefined,

                dimensionList: [],

                state: 0,

                selection: {
                    dataset: undefined,
                    result: undefined,
                    series: undefined,
                    role: {},
                    fields: {}
                },

                restoreState: function (conf, provider) {
                    this.setState(1, provider);
                    if (!conf) return;
                    if (!conf.dataset)return;
                    this.setState(2, conf.dataset);
                    if (!conf.dimensions)return;
                    for (i in conf.dimensions) {
                        this.selection.dimensions[i].set(conf.dimensions[i].collection)
                    }

                    if (!this.readyForDataFetch()) return;
                    this.setState(3);

                    this.selection.role = conf.role;

                    for (i in this.selection.fields) {
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
                                for (i in this.selection.result.header) {
                                    this.selection.fields[this.selection.result.header[i]] = "Not Used";
                                }
                            }

                            this.selection.series = undefined;
                            this.selection.queries = undefined;
                            this.state = 3;

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
                            break;

                        case 5: // Set widget data configuration

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


                            //$scope.result = $scope.getData($scope.widget.data, $scope.provider);
                            break;
                    }
                    //console.log("Dialog state ", this.state, this);
                },



                getDatasetStyle: function (dataset) {
                    if (this.selection.dataset == dataset) {
                        return {"background-color": "rgb(170, 200, 210)"}
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
                    for (i in this.selection.dimensions)
                        if (this.selection.dimensions[i].length() == 0) return false;
                    return true;
                },

                changeFieldRole: function (field) {
                    this.setState(3);

                    var newRole = this.selection.fields[field];

                    for (i in this.selection.fields) {
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
                        return false
                    }
                }
            }

            return BarChartDialog;

        }]);

    })