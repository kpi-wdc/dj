require.config({
    paths: {
        'statkit': 'widgets/data-util/statkit'},
    shim: {
        'statkit':{
            exports: 'statkit'
        }
    }
});


define(['angular',"statkit"], function (angular,statkit) {

    var m = angular.module('app.widgets.data-util.stat', []);

    m.factory('STAT', function() {
        return statkit;
    });

});
