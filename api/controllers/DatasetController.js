/**
 * DatasetController
 *
 * @description :: Server-side logic for managing Datasets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var converter = require("wdc-xlsx-converter");
var mime = require('mime');
var path = require('path');
var uuid = require('uuid');
var query = require("wdc-query");
var dictionaryController = require("./DictionaryController");
var getProperty = require("wdc-flat").getProperty;
var flat2json = require("wdc-flat").flat2json;
var util = require("util");


var prepareCommitInfo = function(obj){
    delete obj.data;
    obj.metadata.dataset.commit.createdAt = obj.createdAt;
    obj.metadata.dataset.commit.id = obj.id;
    obj.metadata.dataset.commit.author = obj["commit/author"];
    obj.metadata.dataset.commit.HEAD = obj["commit/HEAD"];
    obj.metadata.dataset.status = obj["dataset/status"];
    delete obj.id;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj["dataset/id"];
    delete obj["commit/HEAD"];
    delete obj["commit/author"];
    delete obj["dataset/status"];
    if (obj.metadata.layout){
      delete obj.metadata.layout;
    }
    if(obj.metadata.dimension){
      delete obj.metadata.dimension;
    }
    if (obj.dictionary){
      delete obj.dictionary;
    }  
    return obj
  }


var prepareDataset = function(obj){
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
  }  

var prepareEmptyDataset = function(obj){
  obj = prepareDataset(obj);
  obj.data = [];
  return obj;
}  




// TODO select user from session and set commit.author in createDataset, updateDataset

module.exports = {

  createDataset: function(req, res) {

      // sails.log.debug("Current User",req.user);
      Dictionary.find({}).then(function(json){
      var dict = new query()
        .from(json)
        .map(function(item){
          var tmp =  item.toJSON();
          delete tmp.createdAt;
          delete tmp.updatedAt;
          delete tmp.id;
          return tmp;
        })
        .get();
      var file = uuid.v1();
      var dataset = converter.createDataset(file,dict);
      delete dataset.data;
      dict = dataset.dictionary;
      dataset.metadata.dataset.status = "private";
      dataset.metadata.dataset.commit.author = req.user.name;
      // dictionaryController.updateDictionary(dict);
      delete dataset.dictionary;

      Dataset.create(dataset)
        .then(function (obj) {
            file += "("+obj.id+")";
            obj.dictionary = dict;
            res.setHeader('Content-disposition', 'attachment; filename=' + file+".xlsx");
            res.setHeader('Content-type', mime.lookup(path.basename(file+".xlsx")));
            return res.send(converter.buildXLS(prepareEmptyDataset(obj)));
          });
      });
  },

  updateDataset: function(req, res) {
    req.file('file').upload({},
      function (err, uploadedFiles) {
        
        if (err) {
          return res.negotiate(err);
        }

        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var uploadedFileAbsolutePath = uploadedFiles[0].fd;
        var dataset = converter.parseXLS(uploadedFileAbsolutePath);
        var dict = dataset.dictionary;

        dictionaryController.updateDictionary(dict);
        delete dataset.dictionary;
        dataset.metadata.dataset.commit.author = req.user.name;
        Dataset.findOne(
          { "dataset/id":dataset.metadata.dataset.id,
            "commit/HEAD":true
          }).then(function (obj){
            if(!obj){
              Dataset.create(dataset,function (err, obj) {
                      if (err) {
                        sails.log.error('Error while adding new data source: ' + err);
                        return res.serverError();
                      } else {
                        // TODO send operation status
                        return res.send(obj);
                      }
              })        
            }else{
              Dataset.destroy(
                {   "dataset/id":dataset.metadata.dataset.id,
                    createdAt : {">=" : obj.createdAt},
                    "commit/HEAD":false
                }).then(function(){
                  Dataset.update({"dataset/id":dataset.metadata.dataset.id},{"commit/HEAD":false})
                    .then( function(){
                      Dataset.create(dataset,function (err, obj) {
                        if (err) {
                          sails.log.error('Error while adding new data source: ' + err);
                          return res.serverError();
                        } else {
                          // TODO send operation status
                          return res.send(prepareCommitInfo(obj));
                        }
                     });
                });
              })
            }    
          })
     });
  },

  getMetadataList: function(req, res) {
    var params = req.body;
    
    var mq = {"commit/HEAD":true}; 
    if(!params || !params.status || params.status == "public"){
        mq["dataset/status"] = "public";
    }
    
   
      Dataset.find(mq)
        .then(function(obj){
          var r = new query()
              .from(obj)
              .map(function(item){return prepareDataset(item).metadata})
              .get();
          if(!params.query){
            return res.send(r);
          }else{
            r = new query()
                  .from(r)
                  .select(function(data){
                    outerOrC = false;
                    for(i in params.query){
                      var andC = true;
                      for(prop in params.query[i]){
                        var values = getProperty(data,prop);
                        var test = params.query[i][prop];
                        var orC = false;
                        values.forEach(function(valuesItem){
                          test.forEach(function(testItem){
                              testItem = (util.isString(testItem)) ? {equals:testItem} : testItem;
                              if(testItem.equals){
                                orC |= valuesItem === testItem.equals;  
                              }
                              if(testItem.notEquals){
                                orC |= valuesItem !== testItem.notEquals;  
                              }
                              if(testItem.startsWith){
                                orC |= valuesItem.indexOf(testItem.startsWith) === 0;  
                              }
                              if(testItem.endsWith){
                                orC |= valuesItem.match(testItem.endsWith+"$") == testItem.endsWith;  
                              }
                              if(testItem.includes){
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

            return res.send(r);
          }      
        })
  },

  getMetadata: function(req,res){
    var datasetID = req.params.datasetID;
    Dataset.findOne({ 
      "dataset/id":datasetID,
      "commit/HEAD":true
    }).then(function(obj){
      return res.send(prepareDataset(obj).metadata);
    })
  },

  getTagList: function(req,res){
      var params = req.body;
      if(!params){
        return res.send([]);
      }

      var mq = {"commit/HEAD":true}; 
      if(!params || !params.status || params.status == "public"){
          mq["dataset/status"] = "public"
      }
       

      Dataset.find(mq)
        .then(function(obj){
          var r = new query()
              .from(obj)
              .map(function(item){
                  var tmp = getProperty(item, params.property);
                  return tmp;
              })
              .select(function(item){return item})
              .map(function(item){
                if(item.split){
                  return item.split("/")
                }
                return item
              })
              .group(function(item){
                  return {key:item,value:item}
              })
              .map(function(item){
                  return {tag:item.key,count:item.values.length}
              })
              .get();
          return res.send(r);    
        })      
  },

  getTagTotal: function(req,res){
    var params = req.body;
    
    var mq = {"commit/HEAD":true}; 
    if(!params || !params.status || params.status == "public"){
        mq["dataset/status"] = "public"
    }

      Dataset.find(mq)
        .then(function(obj){
          if(!params || !params.property){
            return res.send({tag:"dataset", count:obj.length});
          }
          var r = new query()
              .from(obj)
              .map(function(item){
                  var tmp = getProperty(item, params.property);
                  return tmp;
                })
              .select(function(item){return item})
              .map(function(item){
                if(item.split){
                  return item.split("/")
                }
                return item
              })
              .group(function(item){
                  return {key:item,value:item}
                })
              .map(function(item){
                  return {tag:item.key,count:item.values.length}
                })
              .length();

          return res.send({tag:params.property,count:r});    
        })      
  },

  getCommitList: function(req, res) {
    Dataset.find({"dataset/id": req.params.datasetID})
    .then(function(obj){
      obj = new query()
        .from(obj)
        .orderBy(function(a,b){return a.createdAt<b.createdAt})
        .map(function(item){return prepareCommitInfo(item)})
        .get();

      return res.send(obj);
    })
  },

  setHead: function(req, res) {
    var commitID = req.params.commitID;
    Dataset.findOne({id:commitID})
      .then(function(obj){
        var datasetID = obj["dataset/id"];
        Dataset.update({"dataset/id":datasetID},{"commit/HEAD":false})
        .then(function(){
         Dataset.update({id:commitID},{"commit/HEAD":true})
          .then(function(obj){
            return res.send(obj);
          }) 
        })
      })
  },

  getDataset: function(req, res) {
    var datasetID = req.params.datasetID;
    Dataset.findOne({ 
      "dataset/id":datasetID,
      "commit/HEAD":true
    }).then(function(obj){
      return res.send(prepareDataset(obj));
    })
  },

  downloadCommit: function(req, res) {
    var commitID = req.params.commitID;
    Dataset.findOne({ 
      "id":commitID
    }).then(function(obj){
        Dictionary.find({}).then(function(json){
          var dict = new query()
                .from(json)
                .map(function(item){
                  var tmp =  item.toJSON();
                  delete tmp.createdAt;
                  delete tmp.updatedAt;
                  delete tmp.id;
                  return tmp;
                })
                .get();
          obj = prepareDataset(obj);
          obj.dictionary = dict;      
          var file = obj.metadata.dataset.id+"("+obj.id+").xlsx";
          res.setHeader('Content-disposition', 'attachment; filename=' + file);
          res.setHeader('Content-type', mime.lookup(path.basename(file)));
          return res.send(converter.buildXLS(obj));
        });
      });
  },

  deleteCommit: function(req,res){
    var commitID = req.params.commitID;
    Dataset.destroy({ 
      "id":commitID
    }).exec(function(err,obj){
      if(err){
        res.serverError(err);
      }else{
        return res.ok();
      }  
    });
  },

  downloadDataset: function(req, res) {
    var datasetID = req.params.datasetID;
    Dataset.findOne({ 
      "dataset/id":datasetID,
      "commit/HEAD":true
    }).then(function(obj){
        Dictionary.find({}).then(function(json){
          var dict = new query()
                .from(json)
                .map(function(item){
                  var tmp =  item.toJSON();
                  delete tmp.createdAt;
                  delete tmp.updatedAt;
                  delete tmp.id;
                  return tmp;
                })
                .get();
          obj = prepareDataset(obj);
          obj.dictionary = dict;      
          var file = obj.metadata.dataset.id+"("+obj.id+").xlsx";
          res.setHeader('Content-disposition', 'attachment; filename=' + file);
          res.setHeader('Content-type', mime.lookup(path.basename(file)));
          return res.send(converter.buildXLS(obj));
        });
      });
  },

  getTopicTree: function(req, res) {
    var params = req.body;
    
      var mq = {"commit/HEAD":true}; 
      if(!params || !params.status || params.status == "public"){
          mq["dataset/status"] = "public"
      }

    Dataset.find(mq)
        .then(function(obj){
              var tree = new query()
              .from(obj)
              .map(function(item){
                return item.metadata.dataset.topics
              })
              .select(function(item){
                return item.indexOf("/") >= 0;
              })
              .map(function(item){
                var tmp = item.split("/");
                var r = [];
                for (var i=1; i<=tmp.length; i++){
                  var p = tmp.slice(0,i);
                  r.push({path:tmp.slice(0,i).join(".")+"._path", value:p.join("/")})
                  r.push({path:tmp.slice(0,i).join(".")+"._tag", value:p.pop()})
                }
                return r;
              })
              .get();

             return res.send(flat2json(tree));
        })     
  }

};

