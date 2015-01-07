require.config({
    paths: {
        'jsinq': 'components/jsinq/source/jsinq',
        'jsinq-query': 'components/jsinq/source/jsinq-query',
        "stat":'widgets/data-util/stat'

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


define(['angular','jsinq','jsinq-query','stat'], function (angular, jsinq) {

    var m = angular.module('app.widgets.data-util.adapter', ['app.widgets.data-util.stat']);


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
                //console.log(result)

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
                        conf.selectedDataset.dimensions[rowsDim].id +
                        " == " + str(rowCollection[row].label)+ " select r";
                    //console.log(qr)
                    var query = new jsinq.Query(qr);
                    query.setValue(0, new jsinq.Enumerable(result.data));
                    var rowData = query.execute().toArray();
                    var current = {};
                    current.label = rowCollection[row].label;
                    current.id = rowCollection[row].id;
                    current.values = {};

                    for(var column in columnCollection ){
                        //    get current record for current column
                        var qc = "from r in $0 where r."+
                            conf.selectedDataset.dimensions[columnsDim].id +
                            " == " + str(columnCollection[column].label) + " select r";
                        //console.log(qc)
                        var query = new jsinq.Query(qc);
                        query.setValue(0, new jsinq.Enumerable(rowData));
                        var colData = query.execute().toArray();
                        if(!splitCollection){
                            for(var rr in colData){
                                //colData[rr].value = (colData[rr].value)?colData[rr].value : undefined;
                                current.values[columnCollection[column].label]=colData[rr].value;
                                //current.values[columnCollection[column].id]=colData[rr].value;
                            }
                        }else{
                            for(var splitter in splitCollection){
                                var q = "from r in $0 where r."+
                                    conf.selectedDataset.dimensions[splitDim].id + " == " +
                                    str(splitCollection[splitter].label) + " select r";
                                //console.log(q)
                                var query = new jsinq.Query(q);
                                query.setValue(0, new jsinq.Enumerable(colData));
                                var splitData = query.execute().toArray();
                                for(var rr in splitData){
                                    //splitData[rr].value = (splitData[rr].value) ? splitData[rr].value : undefined;
                                    current.values[columnCollection[column].label+", "+splitCollection[splitter].label]=splitData[rr].value;
                                    //current.values[columnCollection[column].id+", "+splitCollection[splitter].id]=splitData[rr].value;
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
                    header.body[i].title=i;
                }
                //console.log(r)
                 return {header:header, body:r};

            }
        }

        this.sortTable =  function(table){
            if(!table.header.coordX){
                var item;
                for(var i in table.header.body){
                    if (table.header.body[i].coordX == true){
                        item = table.header.body[i];
                        break;
                    }
                }
                if(item) {
                    table.body.sort(function (a, b) {
                        var result;
                        if (angular.isNumber(a.values[item.label])) {
                            result = a.values[item.label] - b.values[item.label]
                        }
                        if (angular.isString(a.label)) {
                            result = (a.values[item.label] < b.values[item.label]) ? -1 : 1
                        }
                        if (item.order == "Z-A") {
                            result = -result;
                        }
                        return result;
                    })
                }

            }else{
                table.body.sort(function(a,b){
                    var result;
                    if(angular.isNumber(a[table.header.coordX])){
                        result = a[header.coordX]-b[header.coordX]
                    }
                    if(angular.isString(a[table.header.coordX])){
                        result = (a[table.header.coordX] < b[table.header.coordX]) ? -1 : 1
                    }
                    if (table.header.order == "Z-A"){
                        result = -result;
                    }
                    return result;
                })
            }
        }

    })

    m.service('BarSerieGenerator',function() {
        this.getData = function (table) {
            console.log("Table", table)
            var result = [];
            for(var i in table.body){
                var v = [];
                for(var j in table.body[i].values){
                    v.push({label:j, value:table.body[i].values[j]})
                }
                result.push({key:table.body[i].label, values:v})
            }
            console.log("Result", result)
            return result;
        }
    })


    m.service('CorrelationMatrixGenerator',['BarSerieGenerator','STAT', function(BarSerieGenerator,STAT){
            this.getData = function(table){
                var series = BarSerieGenerator.getData(table);
                for(var i in series){
                    series[i].values = series[i].values.map( function(item){return item.value});
                }
                //console.log("CORRELATION PREPARED SERIES",series);
                var result = [];
                for(var i=0; i<series.length; i++){
                    var row = [];
                    for (var j=0; j<series.length; j++){
                        row.push({label:series[j].key,value:STAT.corr(series[i].values,series[j].values)});
                    }
                    result.push({key:series[i].key, values:row})
                }
                //console.log("CORRELATION MATRIX",result);
                return result;
            }
        }
    ]);


    m.service('CorrelationTableGenerator',[ 'CorrelationMatrixGenerator',function(CorrelationMatrixGenerator){
        this.getData = function (table){
            var matrix = CorrelationMatrixGenerator.getData(table);
            var result = {};


            result.body = matrix.map(function(item){
                var current = {};
                for(i in item.values){
                    current[item.values[i].label] = item.values[i].value;
                }
                return {label:item.key, values:current}
            });

            result.body.sort(function(a,b){return (a.label>b.label)? 1:-1})

            //var keys = result.body.map(function(item){return item.label});
            //for(var i=0; i<keys.length; i++){
            //    for(var j=i; j<keys.length; j++){
            //        result.body[i].values[keys[j]] = undefined;
            //    }
            //}


            //console.log(result.body);


            result.header = {};
            result.header.label = table.label;
            result.header.body = {};
            for(var i in result.body[0].values){
                result.header.body[i] = {};
                result.header.body[i].label=i;
                result.header.body[i].title=i;
            }
            //console.log("CORRELATION TABLE", result);
            return result;
        }
    }]);

    m.service('ScatterSerieGenerator',function() {
        this.getData = function (table) {

            var xValues = [];
            var labels = [];
            var base;
            if(table.header.coordX){
                base = table.header.coordX;
                xValues = table.body.map(
                    function(item,index){
                      if (!item[table.header.coordX]) return undefined;

                      return (isNaN(item[table.header.coordX])) ?
                          undefined :
                          Number(Number(item[table.header.coordX]).toFixed(4))
                })
            }else{
                var coordX;
                for(var i in table.header.body){
                    if (table.header.body[i].coordX == true){
                        coordX = i;
                        break;
                    }
                }
                if (coordX){
                    base = table.header.body[coordX];
                    xValues = table.body.map(
                        function(item,index){
                            if(!item.values[coordX]) return undefined;
                            return (isNaN(item.values[coordX])) ?
                                undefined :
                                Number(Number(item.values[coordX]).toFixed(4))
                        })
                }
            }

            labels = table.body.map(
                function(item){
                    return item.label
            })

            //console.log(labels);
            //console.log(xValues);
            var result = [];
            for(var i in table.header.body){
                if(table.header.body[i].coordX != true){
                    var yValues = table.body.map(
                        function(item,index){
                            //console.log(item)
                            if(!item.values[i]) return undefined;
                            return (isNaN(item.values[i])) ?
                                undefined :
                                Number(Number(item.values[i]).toFixed(4))
                        }
                    )
                    //console.log(yValues)
                    var values = [];
                    for(var j in labels){
                        values.push({label:labels[j], x:xValues[j], y:yValues[j]})
                    }
                    result.push({key:table.header.body[i].label, base: base,values:values})
                }
            }
            //console.log(result)
            for(var i in result){
                result[i].values = result[i].values.filter(
                    function(item){
                        return angular.isDefined(item.x) && angular.isDefined(item.y) &&
                            !isNaN(item.x) && !isNaN(item.y)
                    }
                )
            }
            console.log(result)
            return result;
        }
    })


    m.service('adapter',['TableGenerator',function(TableGenerator){


        this.getData = function(conf,provider, serieGenerator) {

            if(angular.isUndefined(conf) &&  angular.isUndefined(provider)) return undefined;

            if(angular.isDefined(conf)) {
                if (conf.standalone && conf.series) return conf.series;
            }
            //console.log(conf)
            if(angular.isDefined(conf)) {
                if (conf.standalone && conf.table) return conf.table;
            }

            if(angular.isDefined(provider)) {

                //console.log("GET DATA ADAPTER",conf,provider,serieGenerator)

                var cfg = {};
                cfg.selectedDataset = provider.getDatasets().find(
                    function(item){
                        return item.id == conf.selectedDataset
                    }
                );

                for(var i in cfg.selectedDataset.dimensions){
                    cfg.selectedDataset.dimensions[i].selection = conf.selection[i];
                }

                cfg.selection = conf.selection;
                //console.log("CFG",cfg)
                var table = TableGenerator.getData(cfg,provider);
                if(conf.header){
                    table.header = conf.header;
                    TableGenerator.sortTable(table);
                }
                return serieGenerator.getData(table);
            }
        }

    }])

})