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


    m.service('TableGenerator',function(){

        var str = function(arg){
            return (angular.isString(arg)) ? "'"+arg+"'" : arg;
        };

        this.getData = function(conf,provider) {

            if(angular.isUndefined(conf) &&  angular.isUndefined(provider)) return undefined;

            if(angular.isDefined(conf)) {
                if (conf.standalone && conf.series) return conf.series;
            }

            if(angular.isDefined(provider)) {

                var result = provider.getData(conf.selectedDataset);


                var rowsDim,columnsDim,splitDim,rowCollection,columnCollection,splitCollection;


                for(var i in conf.selection){
                    if(conf.selection[i].role == "Rows"){
                        rowsDim = i;
                        rowCollection = conf.selection[i].collection;
                    }
                    if(conf.selection[i].role == "Columns"){
                        columnCollection = conf.selection[i].collection;
                        columnsDim = i;
                    }
                    if(conf.selection[i].role == "Split Columns"){
                        splitDim = i;
                        splitCollection = conf.selection[i].collection;
                    }
                }

                var r = [];

                for(var row in rowCollection){

                    // get current row from this.result
                    var qr = "from r in $0 where r."+
                       rowsDim +
                        " == " + str(rowCollection[row].label)+ " select r";
                    var query = new jsinq.Query(qr);
                    query.setValue(0, new jsinq.Enumerable(result.data));
                    var rowData = query.execute().toArray();
                    var current = {};
                    current.label = rowCollection[row].label;
                    current.values = {};

                    for(var column in columnCollection ){
                        //    get current record for current column
                        var qc = "from r in $0 where r."+
                           columnsDim +
                            " == " + str(columnCollection[column].label) + " select r";
                        var query = new jsinq.Query(qc);
                        query.setValue(0, new jsinq.Enumerable(rowData));
                        var colData = query.execute().toArray();
                        if(!splitCollection){
                            for(var rr in colData){
                                //current.values[columnCollection[column].label]=colData[rr].value;
                                current.values[columnCollection[column].id]=colData[rr].value;
                            }
                        }else{
                            for(var splitter in splitCollection){
                                var q = "from r in $0 where r."+
                                    splitDim + " == " +
                                    str(splitCollection[splitter].label) + " select r";
                                var query = new jsinq.Query(q);
                                query.setValue(0, new jsinq.Enumerable(colData));
                                var splitData = query.execute().toArray();
                                for(var rr in splitData){
                                    //current.values[columnCollection[column].label+", "+splitCollection[splitter].label]=splitData[rr].value;
                                    current.values[columnCollection[column].id+", "+splitCollection[splitter].id]=splitData[rr].value;
                                }
                            }
                        }
                    }
                    r.push(current);
                }
                var header = {};
                header.label = conf.selectedDataset.dimensions[rowsDim].label;
                header.body = {};
                for(var i in r[0].values){
                    header.body[i] = {};
                    header.body[i].label=i;
                }
                 return {header:header, body:r};
            }
        }
    })

    m.service('BarSerieGenerator',function() {
        this.getData = function (table) {
            var result = [];
            for(var i in table.body){
                var v = [];
                for(var j in table.body[i].values){
                    v.push({label:j, value:table.body[i].values[j]})
                }
                result.push({key:table.body[i].label, values:v})
            }
            return result;
        }
    })


    m.service('adapter',['TableGenerator',function(TableGenerator){
        this.getData = function(conf,provider, serieGenerator) {

            if(angular.isUndefined(conf) &&  angular.isUndefined(provider)) return undefined;

            if(angular.isDefined(conf)) {
                if (conf.standalone && conf.series) return conf.series;
            }

            if(angular.isDefined(provider)) {
                var cfg = {};
                cfg.selectedDataset = provider.getDatasets()[conf.selectedDataset];
                for(var i in cfg.selectedDataset.dimensions){
                    cfg.selectedDataset.dimensions[i].selection = conf.selection[i];
                }
                cfg.selection = conf.selection;
                var table = TableGenerator.getData(cfg,provider);
                //TODO add table header from conf if needed
                return serieGenerator.getData(table);
            }
        }

    }])

})