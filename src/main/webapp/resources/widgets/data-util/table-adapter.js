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

    var m = angular.module('app.widgets.data-util.table-adapter', []);
    m.service('TableAdapter',function(){
        this.getData = function(series) {
            console.log("TableAdapter",series);
            var result = [];
            // generate [{key:"",values:[]}]
            for(j in series[0].values){
                var row = {};
                var values = [];
                for(i in series){
                    values.push({label:series[i].key,value:series[i].values[j].value});
                }
                row.values = values;
                result.push(row);
            }
                return result;
            }
    })
})