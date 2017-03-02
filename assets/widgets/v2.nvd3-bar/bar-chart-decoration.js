import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-bar/adapter";
import "wizard-directives";
import 'ngReact';
import 'custom-react-directives';
import 'ng-prettyjson';
import 'ng-ace';

var m = angular.module("app.widgets.v2.steps.bar-chart-decoration", [
    'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.bar-chart-adapter",
    "wizard-directives",
    'app.dps',
    "ng.ace"
]);

m.factory("BarChartDecoration", [
    "$http",
    "$dps",
    "$q",
    "parentHolder",
    "BarChartAdapter",
    "pageWidgets",
    "i18n",
    "dialog",
    "$error",
    "dpsEditor",

    function(
        $http,
        $dps,
        $q,
        parentHolder,
        BarChartAdapter,
        pageWidgets,
        i18n,
        dialog, 
        $error,
        dpsEditor) {



        return {
            id: "BarChartDecoration",

            title: "Chart Decoration",

            description: "Setup chart decoration options",

            html: "./widgets/v2.nvd3-bar/bar-chart-decoration.html",



            onStartWizard: function(wizard) {
                this.wizard = wizard;
                this.conf = {
                    decoration: wizard.conf.decoration,
                    dataID: wizard.conf.dataID,
                    script: wizard.conf.script,
                    queryID: wizard.conf.queryID,
                    serieDataId: wizard.conf.serieDataId,
                    optionsUrl: "./widgets/v2.nvd3-bar/options.json",
                    dataUrl: "/api/data/script/",
                    emitters: wizard.conf.emitters
                }

                this.queries = [{$id:'eventSource', $title:'setData(updateWithData) event'}];

                pageWidgets()
                    .filter((item) => item.type == "v2.query-manager")
                    .map((item) => item.queries)
                    .forEach((item) => { this.queries = this.queries.concat(item) })

                if (this.conf.queryID) {
                    let thos = this;
                    this.inputQuery = this.queries.filter((item) => item.$id == this.conf.queryID)[0].$title;
                }
            },

            onFinishWizard: function(wizard) {
                this.conf.decoration.setColor = undefined;
                wizard.conf.decoration = this.conf.decoration;
                wizard.conf.serieDataId = this.conf.serieDataId;
                wizard.conf.queryID = this.conf.queryID;
                wizard.conf.dataID = this.conf.dataID;
                wizard.conf.emitters = this.conf.emitters;
                wizard.conf.script = this.conf.script;

                this.settings = { options: angular.copy(this.options), data: [] };
                this.conf = {};
            },

            onCancelWizard: function(wizard) {
                this.settings = { options: angular.copy(this.options), data: [] };
                this.conf = {};
            },

            reversePalette: function() {
                if (this.conf.decoration.color) {
                    this.conf.decoration.color = this.conf.decoration.color.reverse();
                }
            },

            selectInputData: function() {
                let thos = this;
                thos.wizard.context.postprocessedTable = undefined;
                let iq = this.queries.filter((item) => item.$title == thos.inputQuery)[0];
                this.conf.dataID = (iq.context) ? iq.context.queryResultId: undefined;
                this.conf.queryID = iq.$id;
                this.loadData();
            },

            loadOptions: function() {
                return $http.get(this.conf.optionsUrl)
            },

            loadSeries: function() {
                if (this.conf.dataID)
                    return $dps
                        .post("/api/data/script", {
                            "data": "source(table:'" + this.conf.dataID + "');bar();save()",
                            "locale": i18n.locale()
                        })

                if (this.conf.script)
                    return $dps.post("/api/script", {
                            "script": this.conf.script,
                            "locale": i18n.locale()
                        })
                        .then((resp) => {
                            if (resp.data.type == "error") {
                                $error(resp.data.data)
                                return
                            };
                            return { data: resp }
                        })


                return $http.get("./widgets/v2.nvd3-bar/sample.json")
            },

            loadData: function() {
                let thos = this;

                if (!this.wizard.context.postprocessedTable) {
                    $dps
                        .get("/api/data/process/" + this.conf.dataID)
                        .success(function(resp) {
                            thos.wizard.context.postprocessedTable = resp.value;
                        })
                }


                this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
                    this.loadOptions().then((options) => {
                        thos.options = options.data;
                        if (!thos.conf.decoration) {
                            thos.conf.decoration = BarChartAdapter.getDecoration(thos.options);
                        }

                        thos.conf.decoration.setColor = (palette) => {
                            thos.conf.decoration.color = angular.copy(palette)
                        }
                        thos.options.chart.x = function(d) {
                            return d.label
                        };
                        thos.options.chart.y = function(d) {
                            return d.value
                        };

                        thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;


                        //             thos.conf.decoration.title = thos.dataset.dataset.label;
                        // thos.conf.decoration.subtitle = thos.dataset.dataset.source;
                        // thos.conf.decoration.caption = 'Note:'+ thos.dataset.dataset.note;
                        // thos.conf.decoration.xAxisName = thos.dataset.dataset.label;
                        // thos.conf.decoration.yAxisName = thos.dataset.dataset.label;
                    });
                this.dataLoaded = //(this.dataLoaded) ? this.dataLoaded :
                    this.loadSeries().then((resp) => {
                        if (resp) {
                            // console.log(resp)
                            thos.data = resp.data.data.data;
                            thos.conf.serieDataId = resp.data.data.data_id;
                        }
                    })

                $q.all([this.optionsLoaded, this.dataLoaded]).then(() => {
                    thos.apply()
                });
            },

            activate: function(wizard) {
                // this.dataset = wizard.context.dataset;
                // if (this.conf.dataID) {
                this.loadData();
                // }
            },

            editScript: function() {
                var thos = this;
                dpsEditor(thos.conf.script)
                    .then((script) => {
                        thos.conf.script = script;
                        thos.loadData();
                    })
            },

            apply: function() {
                this.conf.decoration.width = parentHolder(this.wizard.conf).width;
                BarChartAdapter.applyDecoration(this.options, this.conf.decoration);
                this.settings = { options: angular.copy(this.options), data: angular.copy(this.data) };
            }
        }
    }
]);
