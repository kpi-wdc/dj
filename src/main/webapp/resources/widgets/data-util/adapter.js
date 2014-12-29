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

    m.service('ScatterSerieGenerator',function() {
        this.getData = function (table) {

            var xValues = [];
            var labels = [];
            if(table.header.coordX){
                xValues = table.body.map(
                    function(item,index){
                      return (Number(item[table.header.coordX]).toString() == "NaN") ?
                          index :
                          Number(Number(item[table.header.coordX]).toFixed(2))
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
                    xValues = table.body.map(
                        function(item,index){
                            return (Number(item.values[coordX]).toString() == "NaN") ?
                                index :
                                Number(Number(item.values[coordX]).toFixed(2))
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
                            return (Number(item.values[i]).toString() == "NaN") ?
                                index :
                                Number(Number(item.values[i]).toFixed(2))
                        }
                    )
                    //console.log(yValues)
                    var values = [];
                    for(var j in labels){
                        values.push({label:labels[j], x:xValues[j], y:yValues[j]})
                    }
                    result.push({key:table.header.body[i].label, values:values})
                }
            }
            //console.log(result)
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