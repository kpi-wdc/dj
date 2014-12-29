define([
        'angular',
        '/widgets/table/data-widget.js',
        '/widgets/data-dialogs/data-table-dialog.js'
    ],
    function (angular) {

        var m = angular.module('app.widgets.table',[
            'app.widgets.data-widget',
            'app.widgets.data-dialogs.data-table-dialog'
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

        m.controller('TableCtrl',function($scope,DataTableDialog,DataWidget){
            new DataWidget($scope,{
                    dialog: DataTableDialog,
                    //decorationAdapter:DataTableDecorationAdapter,
                    serieGenerator: {getData:function(table){return table}}
                })
            });
    });
