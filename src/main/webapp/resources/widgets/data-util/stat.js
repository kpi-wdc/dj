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

        statkit.normalize = function(data){
            var min = statkit.min(data);
            var max = statkit.max(data);
            var result =  data.map(function (item){return (item-min)/(max-min)})
            return result
        }

        statkit.standardize = function(data){
            var mean = statkit.mean(data);
            var std = statkit.std(data);
            return data.map(function (item){return (item-mean)/std})
        }

        statkit.logNormalize = function(data){
            var mean = statkit.mean(data);
            var std = statkit.std(data);
            return data.map(function (item){return 1/(1+Math.exp((mean-item)/std))})
        }

        return statkit;
    });

});
