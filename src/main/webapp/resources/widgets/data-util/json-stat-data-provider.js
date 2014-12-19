require.config({
    paths: {
        'jsinq': 'components/jsinq/source/jsinq',
        'jsinq-query': 'components/jsinq/source/jsinq-query',
        'json-stat': 'components/jsonstat/json-stat.max'

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

        var JSONstatDataProvider = function(data,dataURL){
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
                for(var key in pattern){
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

            getDatasetLabels: function(){
                return this.provider.Dataset().label;
            },


            getDatasets: function(){
                var id = this.provider.id;


                var result = {};
                for(var i in id){
                    result[id[i]] = {
                        "id" : id[i],
                        "label": this.provider.Dataset(id[i]).label,
                        "source" : this.provider.Dataset(id[i]).source,
                        "updated" : this.provider.Dataset(id[i]).updated,
                        "length" : this.provider.Dataset(id[i]).length
                    };
                    var dims = this.provider.Dataset(id[i]).id;
                    var dimensions = {}
                    for(var j in dims){
                        dimensions[dims[j]]={
                            "id"    :   dims[j],
                            "label" :   this.provider.Dataset(id[i]).Dimension(dims[j]).label,
                            "role"  :   this.provider.Dataset(id[i]).Dimension(dims[j]).role,
                            "length":   this.provider.Dataset(id[i]).Dimension(dims[j]).length
                        }
                        var cats = this.provider.Dataset(id[i]).Dimension(dims[j]).id;
                        var categories = {};
                        for(var k in cats){
                            categories[cats[k]] = {
                              "id"      : cats[k],
                              "label"   : this.provider.Dataset(id[i]).Dimension(dims[j]).Category(cats[k]).label
                            };
                        }
                        dimensions[dims[j]].categories = categories;
                    }
                    result[id[i]].dimensions = dimensions;
                }
                console.log("getDatasets",result)
                return result;
            },

            getDimensions: function(dataset){
                var id = this.provider.Dataset(dataset).id;
                var labels = this.provider.Dataset(dataset).Dimension().label;
                var result = {};
                for(var i in id){
                    result[i] = {"id" : id[i], "label": labels[i]};
                }
                console.log("getDimensions",dataset,result)
                return result;
            },

            getCategories: function(dataset,dimension){
                var id =  this.provider.Dataset(dataset).Dimension(dimension).id;
                var labels = this.provider.Dataset(dataset).Dimension(dimension).label;
                var result = {};
                for(var i in id){
                    result[i] = {"id" : id[i], "label": labels[i]};
                }
                console.log("getCategories",dataset,result)
                return result;
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

            getDimensionLabels: function(dataset){
                return this.provider.Dataset(dataset).Dimension().label
            },

            getDimensionLabel: function(dataset,dimension){
                return this.provider.Dataset(dataset).Dimension(dimension).label
            },

            getDimensionIdList: function(dataset,dimension){
                return this.provider.Dataset(dataset).Dimension(dimension).id
            },

            getCategoryLabels: function(dataset,dimension){
                return this.provider.Dataset(dataset).Dimension(dimension).label
            },

            getCategoryLabel: function(dataset,dimension,category){
                return this.provider.Dataset(dataset).Dimension(dimension).Category(category).label
            },

            getDimensionMemberList: function(dataset,dimension){
                return this.provider.Dataset(dataset).Dimension(dimension).Category().label
            },

            getData: function(dataset,dimensions){
                var test = [];
                for(var i in dimensions){
                    var tmp = [];
                    var cats = dimensions[i].collection;
                    var dim = i;
                    for(var j in cats){
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
                    for(var key in current){
                        if(key!="value"){
                            current[key+"_Label"] = provider.Dataset(dataset).Dimension(key).Category(current[key]).label;
                        }
                    }
                });

                for(var key in data[0]){
                    header.push(key);
                }

                return {header:header,data:data};
            }

        }
        return JSONstatDataProvider;
    }]);



});
