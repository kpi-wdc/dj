/**
 * MetadataController
 *
 * @description :: Server-side logic for Dataset Metadata API
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var query = require("../../wdc_libs/wdc-query");
var aquery = require("../../wdc_libs/wdc-query-async");
var getProperty = require("../../wdc_libs/wdc-flat").getProperty;
var flat2json = require("../../wdc_libs/wdc-flat").flat2json;
var util = require("util");
var Cache = require("./Cache");


var prepareDataset = function (obj) {
  obj.metadata.dataset.commit.createdAt = obj.createdAt;
  obj.metadata.dataset.commit.id = obj.id;
  obj.metadata.dataset.commit.author = obj["commit/author"];
  obj.metadata.dataset.commit.HEAD = obj["commit/HEAD"];
  obj.metadata.dataset.status = obj["dataset/status"];
  obj.data = obj.data || [];
  delete obj.id;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj["dataset/id"];
  delete obj["commit/HEAD"];
  delete obj["commit/author"];
  delete obj["dataset/status"];
  return obj
};

var prepareEmptyDataset = function (obj) {
  obj = prepareDataset(obj);
  obj.data = [];
  return obj;
};

module.exports = {

  
  getMetadataList: function (req, res) {
    sails.log.debug("#getMetadataList");
    var params = req.body;

    var mq = {"commit/HEAD": true};
    if (!params || !params.status || params.status == "public") {
      mq["dataset/status"] = "public";
    }

    params.$url = req.url;

    var criteria = function (data) {
                        outerOrC = false;
                        for (i in params.query) {
                          var andC = true;
                          for (prop in params.query[i]) {
                            var values = getProperty(data, prop);
                            var test = params.query[i][prop];
                            // console.log("values",values)
                            // console.log("test",test)
                            if(values == undefined) return false;
                            
                            var orC = false;
                            values.forEach(function (valuesItem) {
                              test.forEach(function (testItem) {
                                testItem = (util.isString(testItem)) ? {equals: testItem} : testItem;
                                if (testItem.equals) {
                                  orC |= valuesItem === testItem.equals;
                                }
                                if (testItem.notEquals) {
                                  orC |= valuesItem !== testItem.notEquals;
                                }
                                if (testItem.startsWith) {
                                  orC |= valuesItem.indexOf(testItem.startsWith) === 0;
                                }
                                if (testItem.endsWith) {
                                  orC |= valuesItem.match(testItem.endsWith + "$") == testItem.endsWith;
                                }
                                if (testItem.includes) {
                                  orC |= valuesItem.indexOf(testItem.includes) >= 0;
                                }
                              })
                            })
                            andC &= orC;
                          }
                          outerOrC |= andC;
                        }
                        return outerOrC;
                      }

    Cache.get(params)
      .then(function(cachedResult){
        if(cachedResult){
          res.send(cachedResult.value)
        }else{
          // no cached result avaible to do make request
              Dataset.find(mq).then(function (obj) {

              var r; 
              new aquery()
                .from(obj)
                .map(function (item) {
                  return prepareDataset(item).metadata
                })
                // .get()
                .then(function (queryResult){
                  r = queryResult
                  if (!params.query) {
                    Cache.save("dsm",params,r)
                      .then(function(){
                        return res.send(r);    
                      })
                  } else {
                    
                    new aquery()
                      .from(r)
                      .select(criteria)
                      // .get()
                      .then(function (queryResult){
                        Cache.save("dsm",params,queryResult)
                        .then(function(){
                          return res.send(queryResult);    
                        })    
                      })
                    }    
                  })
                })
              }
            })
// , function (err) {
//               sails.log.error('Error while getting a metadata list: ' + err);
//               res.serverError();
//             })
      //   }
      // })
  },

  getMetadata: function (req, res) {
    sails.log.debug("#getMetadataList");
    var datasetID = req.params.datasetID;
    Dataset.findOne({
      "dataset/id": datasetID,
      "commit/HEAD": true
    }).then(function (obj) {
      return res.send(prepareDataset(obj).metadata);
    }, function (err) {
      sails.log.error('Error while getting a metadata by id: ' + datasetID + ' ' + err);
      res.serverError();
    })
  },

  getTagList: function (req, res) {
    sails.log.debug("MetadataController#getTagList");
    var params = req.body;
    sails.log.debug(params);
    
    if (!params) {
      return res.send([]);
    }


    var mq = {"commit/HEAD": true};
    if (!params || !params.status || params.status == "public") {
      mq["dataset/status"] = "public"
    }

    params.$url = req.url;
    

    Cache.get(params)
      .then(function(cachedResult){
        if(cachedResult){
          return res.send(cachedResult.value)
        }else{

           Dataset.find(mq).then(function (obj) {
              new aquery()
                  .from(obj)
                  .map(function (item) {
                    // sails.log.debug("!", item)
                    var tmp = getProperty(item, params.property);
                    return tmp;
                  })
                  .select(function (item) {
                    return item
                  })
                  .map(function (item) {
                    if (item.split) {
                      return item.split("/")
                    }
                    return item
                  })
                  .group(function (item) {
                    return {key: item, value: item}
                  })
                  .map(function (item) {
                    return {tag: item.key, count: item.values.length}
                  })
                  .then(function(r){
                    Cache
                      .save("dsm",params,r)
                      .then(function(){
                        return res.send(r);    
                      })  
                  });
              }, function (err) {
                sails.log.error('Error while getting a tag list' + err);
                res.serverError();
              })
        }
      })
  },

  getDependencies: function(req,resp){
    sails.log.debug("#getDependencies");    
    function getTags(datasets,meta,property){
      return new query()
        .from(datasets)
        .map(function (item) {
          var tmp = getProperty(item, property);
          return tmp;
        })
        .select(function (item) {
          return item
        })
        .map(function (item) {
          if (item.split) {
            return item.split("/")
          }
          return item
        })
        .group(function (item) {
          return {key: item, value: item}
        })
        .map(function (item) {
          return {"tag": item.key, "meta": meta,property:property}
        })
        .get();
    }
    

    var params = req.body;
    if (!params) {
      return resp.send([]);
    }

    var mq = {"commit/HEAD": true};
    if (!params || !params.status || params.status == "public") {
      mq["dataset/status"] = "public"
    }

    params.$url = req.url;
    

    Cache.get(params)
      .then(function(cachedResult){
        if(cachedResult){
          return resp.send(cachedResult.value)
        }else{

          Dataset.find(mq).then(function (obj) {
            var tagList = [];
            for(var i in params.tags){
              tagList = tagList.concat(getTags(obj, params.tags[i].meta, params.tags[i].property));
            }

            tagList.forEach(function(item, index){item.index=index})

            var keywordMap = [];
            for(j in obj){
              var dskw = [];
              for(var i in params.tags){
                dskw = dskw.concat(getTags([obj[j]], params.tags[i].meta, params.tags[i].property));
              }
              var values = [];
              tagList.forEach(function(item){
                values.push(
                  (dskw.filter(function(w){return w.tag == item.tag}).length > 0) ? 1 : 0
                )
              })
              keywordMap.push({dataset:obj[j].id, keywords:values})
            }

            tagList.forEach(function(item){
              item.value = keywordMap
                .map(function(d){return d.keywords[item.index]})
                .reduce(function(s,d){return s+d}) 
            })


            var links = [];
            for(var i=0; i<tagList.length-1; i++){
              for(var j=i+1; j<tagList.length; j++){
                var v = 0;
                keywordMap
                          .map(function(d){return {source:d.keywords[tagList[i].index], target:d.keywords[tagList[j].index]}})
                          .forEach(function(d){if (d.source == 1 && d.target == 1)  v++})
                links.push({
                    source:tagList[i].index, 
                    target:tagList[j].index,
                    value: v
                })      
              }  
            }
           
            links = links.filter(function(d){return d.value>0})

            var responsedObject = {"tags":tagList, "links":links, "keywordMap":keywordMap};

            Cache.save("dsm", params, responsedObject)
              .then(function(){
                return resp.send(responsedObject)
              })
  
          })

        }
      })

    
  },

  getTagTotal: function (req, res) {
    sails.log.debug("#getTagTotal"); 
    var params = req.body;

    var mq = {"commit/HEAD": true};
    if (!params || !params.status || params.status == "public") {
      mq["dataset/status"] = "public"
    }

    params.$url = req.url;
    

    Cache.get(params)
      .then(function(cachedResult){
        if(cachedResult){
          return res.send(cachedResult.value)
        }else{
           Dataset.find(mq).then(function (obj) {
            if (!params || !params.property) {
              return res.send({tag: "dataset", count: obj.length});
            }
            var r = new query()
              .from(obj)
              .map(function (item) {
                var tmp = getProperty(item, params.property);
                return tmp;
              })
              .select(function (item) {
                return item
              })
              .map(function (item) {
                if (item.split) {
                  return item.split("/")
                }
                return item
              })
              .group(function (item) {
                return {key: item, value: item}
              })
              .map(function (item) {
                return {tag: item.key, count: item.values.length}
              })
              .length();

            var responsedObject = {tag: params.property, count: r};
            
            Cache.save("dsm", params, responsedObject)
              .then(function(){
                return res.send({r:responsedObject})
              })   

          }, function (err) {
            sails.log.error('Error while getting a total count of tags: ' + err);
            res.serverError();
          })


        }

      })

  },

  getTopicTree: function(req, res) {
    sails.log.debug("#getTopicTree");
    var params = req.body;

    var mq = {"commit/HEAD": true};
    if (!params || !params.status || params.status == "public") {
      mq["dataset/status"] = "public"
    }

    var temp = {
      query:"getTopicTree", 
      $url:req.url
    }

     Cache.get(temp)
      .then(function(cachedResult){
        if(cachedResult){
          return res.send(cachedResult.value)
        }else{

            Dataset.find(mq).then(function (obj) {
              var tree = new query()
                .from(obj)
                .map(function (item) {
                  return item.metadata.dataset.topics
                })
                .select(function (item) {
                  return item.indexOf("/") >= 0;
                })
                .map(function (item) {
                  var tmp = item.split("/");
                  var r = [];
                  for (var i = 1; i <= tmp.length; i++) {
                    var p = tmp.slice(0, i);
                    r.push({path: tmp.slice(0, i).join(".") + "._path", value: p.join("/")})
                    r.push({path: tmp.slice(0, i).join(".") + "._tag", value: p.pop()})
                  }
                  return r;
                })
                .get();

              var responseObject = flat2json(tree);
              Cache.save("dsm", temp ,responseObject)
                .then(function(){
                  return res.send(responseObject)    
                })  
            }, function (err) {
              sails.log.error('Error while getting a topic tree: ' + err);
              res.serverError();
            })

        }
      })    

  }

};

