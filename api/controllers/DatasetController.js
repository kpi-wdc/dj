/**
 * DatasetController
 *
 * @description :: Server-side logic for managing Datasets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var converter = require("../../wdc_libs/wdc-xlsx-converter");
var mime = require('mime');
var path = require('path');
var uuid = require('uuid');
var query = require("../../wdc_libs/wdc-query");
var dictionaryController = require("./DictionaryController");
var getProperty = require("../../wdc_libs/wdc-flat").getProperty;
var flat2json = require("../../wdc_libs/wdc-flat").flat2json;
var util = require("util");
var executeQuery = require("../../wdc_libs/wdc-table-generator").prepare;
var prepareTimeline = require("../../wdc_libs/wdc-timeline").createSerie;
var toXLS = require("../../wdc_libs/wdc-table-generator").prepareXLS;
var I18N = require("../../wdc_libs/wdc-i18n");
var Cache = require("./Cache");



var prepareCommitInfo = function (obj) {
  obj.metadata.dataset.commit.createdAt = obj.createdAt;
  obj.metadata.dataset.commit.id = obj.id;
  obj.metadata.dataset.commit.author = obj["commit/author"];
  obj.metadata.dataset.commit.HEAD = obj["commit/HEAD"];
  obj.metadata.dataset.status = obj["dataset/status"];
  delete obj.id;
  delete obj.data;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj["dataset/id"];
  delete obj["commit/HEAD"];
  delete obj["commit/author"];
  delete obj["dataset/status"];
  if (obj.metadata.layout) {
    delete obj.metadata.layout;
  }
  if (obj.metadata.dimension) {
    delete obj.metadata.dimension;
  }
  if (obj.dictionary) {
    delete obj.dictionary;
  }
  return obj
};


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


// TODO select user from session and set commit.author in createDataset, updateDataset

module.exports = {

  createDataset: function (req, res) {

    // sails.log.debug("Current User",req.user);
    Dictionary.find({}).then(function (json) {
      var dict = new query()
        .from(json)
        .map(function (item) {
          var tmp = item.toJSON();
          delete tmp.createdAt;
          delete tmp.updatedAt;
          delete tmp.id;
          return tmp;
        })
        .get();
      var file = uuid.v1();
      var dataset = converter.createDataset(file, dict);
      delete dataset.data;
      dict = dataset.dictionary;
      dataset.metadata.dataset.status = "private";
      dataset.metadata.dataset.commit.author = req.user.name;
      // dictionaryController.updateDictionary(dict);
      delete dataset.dictionary;

      Dataset.create(dataset)
        .then(function (obj) {
          file += "(" + obj.id + ")";
          obj.dictionary = dict;
          res.setHeader('Content-disposition', 'attachment; filename=' + file + ".xlsx");
          res.setHeader('Content-type', mime.lookup(path.basename(file + ".xlsx")));
          return res.send(converter.buildXLS(prepareEmptyDataset(obj)));
        });
    }, function (err) {
      sails.log.error('Error while creating a new data set: ' + json + ' ' + err);
      res.serverError();
    });
  },




  updateDataset: function (req, res) {
    req.file('file').upload({},
      function (err, uploadedFiles) {

        if (err) {
          return res.negotiate(err);
        }

        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var uploadedFileAbsolutePath = uploadedFiles[0].fd;

        var validationResult = converter.validate(uploadedFileAbsolutePath);
        if(validationResult.error){
          return res.send(validationResult)
        }

        var dataset = converter.parseXLS(uploadedFileAbsolutePath);
        var dict = dataset.dictionary;

        dictionaryController.updateDictionary(dict);
        delete dataset.dictionary;
        dataset.metadata.dataset.commit.author = req.user.name;
        Dataset.findOne(
          {
            "dataset/id": dataset.metadata.dataset.id,
            "commit/HEAD": true
          }).then(function (obj) {
            if (!obj) {
              Dataset.create(dataset, function (err, obj) {
                if (err) {
                  sails.log.error('Error while adding new data source: ' + err);
                  return res.serverError();
                } else {
                  // TODO send operation status
                  var result = prepareCommitInfo(obj);
                  result.warnings = validationResult.warnings;
                  Cache.clear("dsm")
                    .then(function(){
                      return res.send(result);    
                    })
                }
              })
            } else {
              Dataset.destroy(
                {
                  "dataset/id": dataset.metadata.dataset.id,
                  createdAt: {">=": obj.createdAt},
                  "commit/HEAD": false
                }).then(function () {
                  Dataset.update({"dataset/id": dataset.metadata.dataset.id}, {"commit/HEAD": false})
                    .then(function () {
                      Dataset.create(dataset, function (err, obj) {
                        if (err) {
                          sails.log.error('Error while adding new data source: ' + err);
                          return res.serverError();
                        } else {
                          var result = prepareCommitInfo(obj);
                          result.warnings = validationResult.warnings;
                          Cache.clear("dsm")
                            .then(function(){
                              return res.send(result);    
                            })
                        }
                      });
                    });
                })
            }
          }, function (err) {
            sails.log.error('Error while updating a data set: ' + err);
            res.serverError();
          })
      });
  },


  createTimeline: function (req, res) {
    req.file('file').upload({},
      function (err, uploadedFiles) {

        if (err) {
          return res.negotiate(err);
        }

        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var uploadedFileAbsolutePath = uploadedFiles[0].fd;
        var dataset = converter.parseXLSTimeline(uploadedFileAbsolutePath)
        var result = prepareTimeline(dataset.data,"","",dataset.metadata.timeDomain);
        var obj_to_save = {
            value: result,
          };
          
        ProcData
          .create(obj_to_save)
          .then(function(obj){
            ProcData.findOne({id:obj.id})
            .then(function(founded){
              return res.json(founded)
            })
            // return res.json(obj);
          })
      })  
  },

  getMetadataList: function (req, res) {
    var params = req.body;

    var mq = {"commit/HEAD": true};
    if (!params || !params.status || params.status == "public") {
      mq["dataset/status"] = "public";
    }

    params.$url = req.url;

    Cache.get(params)
      .then(function(cachedResult){
        if(cachedResult){
          res.send(cachedResult.value)
        }else{
          // no cached result avaible to do make request
              Dataset.find(mq).then(function (obj) {
              var r = new query()
                .from(obj)
                .map(function (item) {
                  return prepareDataset(item).metadata
                })
                .get();
              if (!params.query) {
                Cache.save("dsm",params,r)
                  .then(function(){
                    return res.send(r);    
                  })
              } else {
                r = new query()
                  .from(r)
                  .select(function (data) {
                    outerOrC = false;
                    for (i in params.query) {
                      var andC = true;
                      for (prop in params.query[i]) {
                        var values = getProperty(data, prop);
                        var test = params.query[i][prop];
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
                  })
                  .get();

                Cache.save("dsm",params,r)
                  .then(function(){
                    return res.send(r);    
                  })    
              }
            }, function (err) {
              sails.log.error('Error while getting a metadata list: ' + err);
              res.serverError();
            })

          //
        }
      })

    // Dataset.find(mq).then(function (obj) {
    //   var r = new query()
    //     .from(obj)
    //     .map(function (item) {
    //       return prepareDataset(item).metadata
    //     })
    //     .get();
    //   if (!params.query) {
    //     return res.send(r);
    //   } else {
    //     r = new query()
    //       .from(r)
    //       .select(function (data) {
    //         outerOrC = false;
    //         for (i in params.query) {
    //           var andC = true;
    //           for (prop in params.query[i]) {
    //             var values = getProperty(data, prop);
    //             var test = params.query[i][prop];
    //             var orC = false;
    //             values.forEach(function (valuesItem) {
    //               test.forEach(function (testItem) {
    //                 testItem = (util.isString(testItem)) ? {equals: testItem} : testItem;
    //                 if (testItem.equals) {
    //                   orC |= valuesItem === testItem.equals;
    //                 }
    //                 if (testItem.notEquals) {
    //                   orC |= valuesItem !== testItem.notEquals;
    //                 }
    //                 if (testItem.startsWith) {
    //                   orC |= valuesItem.indexOf(testItem.startsWith) === 0;
    //                 }
    //                 if (testItem.endsWith) {
    //                   orC |= valuesItem.match(testItem.endsWith + "$") == testItem.endsWith;
    //                 }
    //                 if (testItem.includes) {
    //                   orC |= valuesItem.indexOf(testItem.includes) >= 0;
    //                 }
    //               })
    //             })
    //             andC &= orC;
    //           }
    //           outerOrC |= andC;
    //         }
    //         return outerOrC;
    //       })
    //       .get();

    //     return res.send(r);
    //   }
    // }, function (err) {
    //   sails.log.error('Error while getting a metadata list: ' + err);
    //   res.serverError();
    // })
  },

  getMetadata: function (req, res) {
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
    var params = req.body;
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
                  .get();

                Cache.save("dsm",params,r)
                  .then(function(){
                    return res.send(r);    
                  })  
                
              }, function (err) {
                sails.log.error('Error while getting a tag list' + err);
                res.serverError();
              })

        }
      })

    // Dataset.find(mq).then(function (obj) {
    //   var r = new query()
    //     .from(obj)
    //     .map(function (item) {
    //       var tmp = getProperty(item, params.property);
    //       return tmp;
    //     })
    //     .select(function (item) {
    //       return item
    //     })
    //     .map(function (item) {
    //       if (item.split) {
    //         return item.split("/")
    //       }
    //       return item
    //     })
    //     .group(function (item) {
    //       return {key: item, value: item}
    //     })
    //     .map(function (item) {
    //       return {tag: item.key, count: item.values.length}
    //     })
    //     .get();
    //   return res.send(r);
    // }, function (err) {
    //   sails.log.error('Error while getting a tag list' + err);
    //   res.serverError();
    // })
  },

  getDependencies: function(req,resp){
    
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

    // Dataset.find(mq).then(function (obj) {
    //   var tagList = [];
    //   for(var i in params.tags){
    //     tagList = tagList.concat(getTags(obj, params.tags[i].meta, params.tags[i].property));
    //   }

    //   tagList.forEach(function(item, index){item.index=index})

    //   var keywordMap = [];
    //   for(j in obj){
    //     var dskw = [];
    //     for(var i in params.tags){
    //       dskw = dskw.concat(getTags([obj[j]], params.tags[i].meta, params.tags[i].property));
    //     }
    //     var values = [];
    //     tagList.forEach(function(item){
    //       values.push(
    //         (dskw.filter(function(w){return w.tag == item.tag}).length > 0) ? 1 : 0
    //       )
    //     })
    //     keywordMap.push({dataset:obj[j].id, keywords:values})
    //   }

    //   tagList.forEach(function(item){
    //     item.value = keywordMap
    //       .map(function(d){return d.keywords[item.index]})
    //       .reduce(function(s,d){return s+d}) 
    //   })


    //   var links = [];
    //   for(var i=0; i<tagList.length-1; i++){
    //     for(var j=i+1; j<tagList.length; j++){
    //       var v = 0;
    //       keywordMap
    //                 .map(function(d){return {source:d.keywords[tagList[i].index], target:d.keywords[tagList[j].index]}})
    //                 .forEach(function(d){if (d.source == 1 && d.target == 1)  v++})
    //       links.push({
    //           source:tagList[i].index, 
    //           target:tagList[j].index,
    //           value: v
    //       })      
    //     }  
    //   }
     
    //   links = links.filter(function(d){return d.value>0})

    //   return resp.send({"tags":tagList, "links":links, "keywordMap":keywordMap});  
    // })

  },

  getTagTotal: function (req, res) {
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

    // Dataset.find(mq).then(function (obj) {
    //   if (!params || !params.property) {
    //     return res.send({tag: "dataset", count: obj.length});
    //   }
    //   var r = new query()
    //     .from(obj)
    //     .map(function (item) {
    //       var tmp = getProperty(item, params.property);
    //       return tmp;
    //     })
    //     .select(function (item) {
    //       return item
    //     })
    //     .map(function (item) {
    //       if (item.split) {
    //         return item.split("/")
    //       }
    //       return item
    //     })
    //     .group(function (item) {
    //       return {key: item, value: item}
    //     })
    //     .map(function (item) {
    //       return {tag: item.key, count: item.values.length}
    //     })
    //     .length();

    //   return res.send({tag: params.property, count: r});
    // }, function (err) {
    //   sails.log.error('Error while getting a total count of tags: ' + err);
    //   res.serverError();
    // })
  },

  getCommitList: function (req, res) {
    Dataset.find({"dataset/id": req.params.datasetID}).then(function (obj) {
      obj = new query()
        .from(obj)
        .orderBy(function (a, b) {
          return a.createdAt < b.createdAt
        })
        .map(function (item) {
          return prepareCommitInfo(item)
        })
        .get();

      return res.send(obj);
    }, function (err) {
      sails.log.error('Error while getting a commit list: ' + err);
      res.serverError();
    })
  },

  setHead: function (req, res) {
    var commitID = req.params.commitID;
    Dataset.findOne({id: commitID}).then(function (obj) {
      var datasetID = obj["dataset/id"];
      Dataset.update({"dataset/id": datasetID}, {"commit/HEAD": false})
        .then(function () {
          Dataset.update({id: commitID}, {"commit/HEAD": true})
            .then(function (obj) {
              Cache.clear("dsm")
                .then(function(){
                  return res.send(prepareCommitInfo(obj[0]));    
                })
            })
        })
    }, function (err) {
      sails.log.error('Error while setting a gead commit: ' + err);
      res.serverError();
    })
  },


  setStatus: function (commitID, status) {
    // sails.log.debug("Commit",commitID)
           return Dataset.update({"id": commitID}, {"dataset/status": status});
  },

  setPublicStatus: function (req, res) {
    var commitID = req.params.commitID;
    this.setStatus(commitID, "public").then(function (obj) {
      // sails.log.debug("OBJECT", obj)
      Cache.clear("dsm")
        .then(function(){
          return res.send(prepareCommitInfo(obj[0]));    
        })
      
    }, function (err) {
      sails.log.error('Error while setting a public status: ' + err);
      res.serverError();
    });
  },

  setPrivateStatus: function (req, res) {
    var commitID = req.params.commitID;
    this.setStatus(commitID, "private").then(function (obj) {
      // sails.log.debug("OBJECT", obj)
      Cache.clear("dsm")
        .then(function(){
          return res.send(prepareCommitInfo(obj[0]));    
        })
      
    }, function (err) {
      sails.log.error('Error while setting a private status: ' + err);
      res.serverError();
    });
  },

  getDataset: function (req, res) {
    var datasetID = req.params.datasetID;
    Dataset.findOne({
      "dataset/id": datasetID,
      "commit/HEAD": true
    }).then(function (obj) {
      return res.send(prepareDataset(obj));
    }, function (err) {
      sails.log.error('Error while getting a data set by id: ' + datasetID + ' ' + err);
      res.serverError();
    })
  },

  downloadCommit: function (req, res) {
    var commitID = req.params.commitID;
    Dataset.findOne({
      "id": commitID
    }).then(function (obj) {
      Dictionary.find({}).then(function (json) {
        var dict = new query()
          .from(json)
          .map(function (item) {
            var tmp = item.toJSON();
            delete tmp.createdAt;
            delete tmp.updatedAt;
            delete tmp.id;
            return tmp;
          })
          .get();
        obj = prepareDataset(obj);
        obj.dictionary = dict;
        var file = obj.metadata.dataset.id + "(" + obj.id + ").xlsx";
        res.setHeader('Content-disposition', 'attachment; filename=' + file);
        res.setHeader('Content-type', mime.lookup(path.basename(file)));
        return res.send(converter.buildXLS(obj));
      });
    }, function (err) {
      sails.log.error('Error while downloading a commit by id: ' + commitID + ' ' + err);
      res.serverError();
    });
  },

  deleteCommit: function (req, res) {
    var commitID = req.params.commitID;
    Dataset.destroy({
      "id": commitID
    }).exec(function (err, obj) {
      if (err) {
        res.serverError(err);
      } else {
        Cache.clear("dsm")
        .then(function(){
          return res.ok();    
        })
        
      }
    });
  },

  downloadDataset: function (req, res) {
    var datasetID = req.params.datasetID;
    Dataset.findOne({
      "dataset/id": datasetID,
      "commit/HEAD": true
    }).then(function (obj) {
      Dictionary.find({}).then(function (json) {
        var dict = new query()
          .from(json)
          .map(function (item) {
            var tmp = item.toJSON();
            delete tmp.createdAt;
            delete tmp.updatedAt;
            delete tmp.id;
            return tmp;
          })
          .get();
        obj = prepareDataset(obj);
        obj.dictionary = dict;
        var file = obj.metadata.dataset.id + "(" + obj.id + ").xlsx";
        res.setHeader('Content-disposition', 'attachment; filename=' + file);
        res.setHeader('Content-type', mime.lookup(path.basename(file)));
        return res.send(converter.buildXLS(obj));
      });
    }, function (err) {
      sails.log.error('Error while downloading a data set by id: ' + datasetID + ' ' + err);
      res.serverError();
    });
  },


  getQueryResult: function(req,resp){
    var params = req.body;
    if(!params){return resp.serverError();}
    var commitID = params.commitID;
    var query = params.query;
    var locale = (params.locale === "uk") ? "ua" : params.locale; //|| "en";
    // find dataset
    // sails.log.debug(params)
    Dataset.findOne({ 
      "id":commitID
    }).then(function(obj){
      if(!obj){return resp.serverError();}
      //execute query
      
      // get dictionary and translate query result
      Dictionary.find({}).then(function(json){
          i18n = new I18N(json);
          obj.data = i18n.translate(obj.data,locale);
          obj.metadata = i18n.translate(obj.metadata,locale);
          
          for(i in obj.metadata.dimension){
            obj.metadata.dimension[i].label = i18n.translate(obj.metadata.dimension[i].label,locale);
            obj.metadata.dimension[i].values = 
              i18n.translate(obj.metadata.dimension[i].values,locale)
          } 
          var result = executeQuery(obj,query);

          result.metadata = {
            type : "Query Result Table",
            source : obj.metadata,
            selection : query
          }

          Table.create({data:result}).then(function (obj){
            result.id = obj.id;
            result.createdAt = obj.createdAt;
            return resp.send(result);  
          });
          
      });          
    });  
  },

  downloadTable: function(req,res){
     var tableID = req.params.tableID;
     Table.findOne({id:tableID}).then(function(obj){
        if(obj){
          var result = toXLS(obj.data);
          // sails.log.debug("Delete table after download", tableID);

          Table.destroy({id:tableID}).then(function(){
            var file = tableID+".xlsx";
            res.setHeader('Content-disposition', 'attachment; filename=' + file);
            res.setHeader('Content-type', mime.lookup(path.basename(file)));
            return res.send(result);
          })
        }else{
          return res.notFound();
        }  
     })
  },

  deleteTable: function(req,res){
     var tableID = req.params.tableID;
     // sails.log("Delete table", tableID);
     Table.destroy({id:tableID}).then(function(){
        res.ok();
     })
  },

  getAllTables: function(req,resp){
    Table.find({}).then(function(obj){return resp.send(obj)})
  },
  

  getTopicTree: function(req, res) {

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


  //   Dataset.find(mq).then(function (obj) {
  //     var tree = new query()
  //       .from(obj)
  //       .map(function (item) {
  //         return item.metadata.dataset.topics
  //       })
  //       .select(function (item) {
  //         return item.indexOf("/") >= 0;
  //       })
  //       .map(function (item) {
  //         var tmp = item.split("/");
  //         var r = [];
  //         for (var i = 1; i <= tmp.length; i++) {
  //           var p = tmp.slice(0, i);
  //           r.push({path: tmp.slice(0, i).join(".") + "._path", value: p.join("/")})
  //           r.push({path: tmp.slice(0, i).join(".") + "._tag", value: p.pop()})
  //         }
  //         return r;
  //       })
  //       .get();

  //     return res.send(flat2json(tree));
  //   }, function (err) {
  //     sails.log.error('Error while getting a topic tree: ' + err);
  //     res.serverError();
  //   })
  }

};

