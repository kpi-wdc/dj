require.config({
    paths: {
        'jsinq': 'components/jsinq/source/jsinq',
        'jsinq-query': 'components/jsinq/source/jsinq-query',

    },
    shim: {
        'jsinq':{
            exports: 'jsinq'
        },
        'jsinq-query':{
            deps:['jsinq']
        }
    }
});


define(['angular','jsinq','jsinq-query'], function (angular,jsinq) {

    var m = angular.module('app.widgets.data-util.adapter', []);
    m.service('adapter',function(){
        this.getData = function(conf,provider) {

            if(angular.isUndefined(conf) &&  angular.isUndefined(provider)) return undefined;

            if(angular.isDefined(conf)) {
                if (conf.standalone && conf.series) return conf.series;
            }

            if(angular.isDefined(provider)) {

                var result = provider.getData(conf.dataset, conf.dimensions).data;
                for (i in conf.queries) {
                    var query = new jsinq.Query(conf.queries[i]);
                    query.setValue(0, new jsinq.Enumerable(result));
                    result = query.execute().toArray();
                }
                return result;
            }
        }

    })
})