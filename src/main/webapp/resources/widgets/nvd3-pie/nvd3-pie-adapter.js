define(['angular'],
    function (angular) {

        var m = angular.module('app.widgets.nvd3.nvd3-pie-adapter', []);
        m.service('NVD3PieAdapter', function () {

            this.applyDecoration = function (options, decoration) {
                if(angular.isDefined(decoration)&&angular.isDefined(options)) {
                    console.log(options)
                    options.chart.height = decoration.height;
                    options.title.text = decoration.title;
                    options.subtitle.text = decoration.subtitle;
                    options.caption.text = decoration.caption;

                    options.chart.donut = decoration.donut;
                    options.chart.donutRatio = decoration.donutRatio;
                    options.chart.donutLabelsOutside = decoration.labelsOutside;
                    options.chart.pieLabelsOutside = decoration.labelsOutside;
                    options.chart.labelType = (decoration.valueAsLabel)?"value":"key";

                }
                return options;
            }

            this.getDecoration = function (options){
                if(angular.isDefined(options)) {

                    var decoration = {}

                    decoration.height = options.chart.height;
                    decoration.title = options.title.text;
                    decoration.subtitle = options.subtitle.text;
                    decoration.caption = options.caption.text;

                    decoration.donut = options.chart.donut;
                    decoration.donutRatio = options.chart.donutRatio;
                    decoration.labelsOutside = options.chart.donutLabelsOutside || options.chart.pieLabelsOutside;
                    decoration.valueAsLabel = (options.chart.labelType =="value");

                    return decoration;
                }
            }
        })
    })