require.config({
    paths: {
        'jsinq': 'components/jsinq/source/jsinq',
        'jsinq-query': 'components/jsinq/source/jsinq-query',
        'json-stat': 'components/jsonstat/json-stat'

    },
    shim: {
        'jsinq':{
            exports: 'jsinq'
        },
        'jsinq-query':{
            deps:['jsinq']
        },
        'json-stat':{
            exports:'JSONstat'
        }
    }
});


define(['angular','jsinq','json-stat','jsinq-query'], function (angular,jsinc,JSONstat) {
    var m = angular.module('app.widgets.data-util.json-stat-data-provider', []);

    m.factory('JSONstatDataProvider', ["$http", function($http){

        JSONstatDataProvider = function(data,dataURL){
            if(JSONstatDataProvider.isCompatible(data)) {
                this.data = data;
                this.dataURL = dataURL;
                this.provider = JSONstat(data);
            }
        }

        JSONstatDataProvider.isCompatible = function(data){
            // TO DO fast recognize data format

            var match = function(source,pattern){
                if(typeof(source)!==typeof(pattern)) return false;
                var result = true;
                for(key in pattern){
                    if(source.hasOwnProperty(key)) {
                        result = result && match(source[key],pattern[key]);
                        if (result == false) return false;
                    }
                }
                return result;
            }


            var pattern = {
                "value":[],
                "dimension":{
                    "id":[],
                    "size":[]
                }
            }
            return match(data,pattern);
        }

        JSONstatDataProvider.prototype = {

            dataFormat:"json-stat",
            dataFormatRef:"http://json-stat.org/",

            getDataURL: function(){
                return this.dataURL;
            },

            getDatasetIdList: function(){
                return this.provider.id;
            },

            getDatasetLabel: function(dataset){
                return this.provider.Dataset(dataset).label;
            },

            getDatasetSource: function(dataset){
                return this.provider.Dataset(dataset).source;
            },

            getDatasetUpdated: function(dataset){
                return this.provider.Dataset(dataset).updated;
            },

            getDimensionList: function(dataset){
                return this.provider.Dataset(dataset).id
            },

            getDimensionLabel: function(dataset,dimension){
                return this.provider.Dataset(dataset).Dimension(dimension).label
            },

            getDimensionIdList: function(dataset,dimension){
                return this.provider.Dataset(dataset).Dimension(dimension).id
            },

            getCategoryLabel: function(dataset,dimension,category){
                return this.provider.Dataset(dataset).Dimension(dimension).Category(category).label
            },

            getDimensionMemberList: function(dataset,dimension){
                return this.provider.Dataset(dataset).Dimension(dimension).Category().label
            },

            getData: function(dataset,dimensions){
                var test = [];
                for(i in dimensions){
                    var tmp = [];
                    var cats = dimensions[i].collection;
                    var dim = i;
                    for(j in cats){
                        var item = "r."+dim + " == ";
                        item = (angular.isString(cats[j]))?item+"'"+cats[j]+"'" : item+cats[j];
                        tmp.push(item);
                    }
                    test.push("("+tmp.join("||")+")");
                }
                test = test.join("&&");

                var queryStr = "from r in $0 where "+test+" select r";

                var data = this.provider.Dataset(dataset).toTable({type: "arrobj", content: "id"});
                var query = new jsinq.Query(queryStr);
                query.setValue(0,new jsinq.Enumerable(data));
                data = query.execute().toArray();


                var header = [];
                var provider = this.provider;
                angular.forEach(data,function(current){
                    for(key in current){
                        if(key!="value"){
                            current[key+"_Label"] = provider.Dataset(dataset).Dimension(key).Category(current[key]).label;
                        }
                    }
                });

                for(key in data[0]){
                    header.push(key);
                }

                return {header:header,data:data};
            }

        }
        return JSONstatDataProvider;
    }]);



});

