/**
 *IOController
 *
 * @description :: Server-side logic for import/export support
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var converter = require("../../wdc_libs/wdc-xlsx-converter");
var wdc_xlsx =  require("../../wdc_libs/parsers/wdc-xlsx");
var ch_datasetGroupParser =  require("../../wdc_libs/parsers/ch-ftp");
var mime = require('mime');
var path = require('path');
var uuid = require('uuid');
var query = require("../../wdc_libs/wdc-query");
var dictionaryController = require("./DictionaryController");
var dataprocController = require("./DataProcController");
var getProperty = require("../../wdc_libs/wdc-flat").getProperty;
var flat2json = require("../../wdc_libs/wdc-flat").flat2json;
var util = require("util");
var executeQuery = require("../../wdc_libs/wdc-table-generator").prepare;
var prepareTimeline = require("../../wdc_libs/wdc-timeline").createSerie;
var toXLS = require("../../wdc_libs/wdc-table-generator").prepareXLS;
var I18N = require("../../wdc_libs/wdc-i18n");
var Cache = require("./Cache");
var date = require("date-and-time");
var Promise = require("bluebird");
var logger = require("../../wdc_libs/wdc-log").global;
var fs = require("fs");




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

var readJsonFile = function(filename) {
    return new Promise(function(resolve){
      fs.readFile(filename, function(err, data) {
          var result = JSON.parse(data);
          resolve(result)
      });
    })
}

// TODO select user from session and set commit.author in createDataset, updateDataset

module.exports = {

  getDatasetMetadataList : function(req,resp){
    logger.info("Get Dataset Collection")
    Dataset.find({"commit/HEAD": true})
      .then(function(list){
        var respList = list.map(function (item){
          return prepareDataset(item).metadata.dataset
        })
        respData = {
          log: logger.success("total: "+respList.length).get(),
          data: {
            collection:"Dataset",
            list:respList
          }
        }
        logger.clear()
        return resp.send(respData)
      })
  },

  getDataset: function (req, res) {
    logger.info("Get Dataset from "+req.host);
    var id = req.params.id;
    id = (id) ? id.split("+") : undefined;

    Dataset.find({
      "commit/HEAD": true
    }).then(function (obj) {
      var responseList = []
      if(obj){
        responseList = new query()
                            .from(obj)
                            .select(function(item){
                              return (id) ? id.indexOf(item["dataset/id"]) >= 0 : true
                            })
                            .map(function(item){
                              return prepareDataset(item)
                            })
                            .get();
      }
      var response = {
        log: logger.success("total: "+responseList.length+" from "+((obj) ? obj.length:"0")).get(),
        data: {
          source: req.host,
          file: req.host+"_export_Dataset_"+date.format(new Date(),"YYYY_MM_DD_hh_mm_ss")+".json",
          type: mime.lookup("json"),
          downloadedAt: new Date(),
          collection:"Dataset",
          list:responseList
        }
      }
      logger.clear();
      res.setHeader('Content-type', mime.lookup("json"));
      res.setHeader('Content-disposition', 'attachment; filename=' + req.host+"_export_Dataset_"+date.format(new Date(),"YYYY_MM_DD_hh_mm_ss")+".json");
      res.setHeader("X-Filename", req.host+"_export_Dataset_"+date.format(new Date(),"YYYY_MM_DD_hh_mm_ss")+".json");
      res.setHeader("Access-Control-Expose-Header","Content-disposition, Content-type, X-Filename");
      return res.send(response);
    }, function (err) {
      var response = {
        log: logger.error('Error while getting a data set by id: ' + datasetID + ' ' + err).get(),
        data:undefined
      }
      logger.clear();
      res.send(response);
    })
  },

  getDictionary: function(req,res){
    Dictionary.find({})
      .then(function (json) {
        if(json){
          var response = {
            log: logger.success("total: "+json.length).get(),
            data: {
              source: req.host,
              file: req.host+"_export_Dictionary_"+date.format(new Date(),"YYYY_MM_DD_hh_mm_ss")+".json",
              type: mime.lookup("json"),
              downloadedAt: new Date(),
              collection:"Dictionary",
              list:json.map(function(item){
                return {
                  key: item.key,
                  type: item.type,
                  value: item.value
                }
              })
            }
          }
        }
        logger.clear();
        res.setHeader('Content-type', mime.lookup("json"));
        res.setHeader('Content-disposition', 'attachment; filename=' + req.host+"_export_Dictionary_"+date.format(new Date(),"YYYY_MM_DD_hh_mm_ss")+".json");
        res.setHeader("X-Filename", req.host+"_export_Dictionary_"+date.format(new Date(),"YYYY_MM_DD_hh_mm_ss")+".json");
        res.setHeader("Access-Control-Expose-Header","Content-disposition, Content-type, X-Filename");
      
        return res.send(response);
      }, function (err) {
        var response = {
            log: logger.error('Error while getting all dictionaries: ' + err).get(),
            data:undefined
          }
          logger.clear();
          res.send(response);
        
      });
  },


  updateDatasets: function(req,res){

    var $createDataset = function(dataset){
      dataset["commit/HEAD"] = true;
      return Dataset
                .create(dataset)
                .then(function(obj){
                  var result = prepareCommitInfo(obj);
                   return result
                });
    }

    var $makeHeadCommit = function(dataset,obj){
        return new Promise(function(resolve){
          Dataset
                .destroy(
                  {
                    "dataset/id": dataset.metadata.dataset.id,
                    createdAt: {">=": obj.createdAt},
                    "commit/HEAD": false
                  })
                .then(function () {
                  Dataset
                          .update({"dataset/id": dataset.metadata.dataset.id}, {"commit/HEAD": false})
                          .then(function(obj){
                            resolve(obj)
                          })
                })
        })
    }

    var $updateDataset = function(dataset){
      return new Promise(function (resolve){
        Dataset
                  .findOne(
                    {
                      "dataset/id": dataset.metadata.dataset.id,
                      "commit/HEAD": true
                    })
                  .then(function (obj) {
                    if (!obj) {
                      
                        $createDataset(dataset)
                          .then(function(result){
                            logger.info("create "+result.metadata.dataset.id)
                            resolve(result);
                          })
                     
                    } else {
                        $makeHeadCommit(dataset,obj)
                          .then(function(){
                              $createDataset(dataset)
                                .then(function(result){
                                  logger.info("update "+result.metadata.dataset.id)
                                  dataprocController.updateCache(result.metadata.dataset.id)
                                    .then(function(){
                                      resolve(result);
                                    })                                  
                                })
                          })
                    }
                  }) 
      })
    }

    var promises = [];


     logger.info("Import datasets")
     req.file('file')
      .upload({},function (err, uploadedFiles) {
          if (err) {
            return res.negotiate(err);
          }
          if (uploadedFiles.length === 0) {
            return res.badRequest('No file was uploaded');
          }

          var uploadedFileAbsolutePath = uploadedFiles[0].fd;
          logger.info("Parse file "+uploadedFileAbsolutePath);
          readJsonFile(uploadedFileAbsolutePath)
            .then(function(json){
              var list = json.data.list;
              logger.info("Import "+json.data.list.length+" datasets from "+json.data.source+" downloaded at "+date.format(new Date(json.data.downloadedAt),"YYYY.MM.DD hh:mm:ss"))
              list.forEach(function(item){
                logger.info("process "+ item.metadata.dataset.id)
                item.metadata.dataset.commit.note = "replica from "+json.data.source+" at "+date.format(new Date(json.data.downloadedAt),"YYYY.MM.DD hh:mm:ss");
                promises.push($updateDataset(item))
              })
              Promise
                .all(promises)
                .then(function(){
                  var response = {
                    log: logger.success("Total: "+list.length).get()
                  }
                  logger.clear();
                  res.send(response);
                })
            })
      })    
  },

  importDataset: function(req,res){

      var $createDataset = function(dataset){
        dataset["commit/HEAD"] = true;
        return Dataset
                  .create(dataset)
                  .then(function(obj){
                    var result = prepareCommitInfo(obj);
                     return result
                  });
      }

      var $makeHeadCommit = function(dataset,obj){
          return new Promise(function(resolve){
            Dataset
                  .destroy(
                    {
                      "dataset/id": dataset.metadata.dataset.id,
                      createdAt: {">=": obj.createdAt},
                      "commit/HEAD": false
                    })
                  .then(function () {
                    Dataset
                            .update({"dataset/id": dataset.metadata.dataset.id}, {"commit/HEAD": false})
                            .then(function(obj){
                              resolve(obj)
                            })
                  })
          })
      }

      var $updateDataset = function(dataset){
        return new Promise(function (resolve){
          Dataset
                    .findOne(
                      {
                        "dataset/id": dataset.metadata.dataset.id,
                        "commit/HEAD": true
                      })
                    .then(function (obj) {
                      if (!obj) {
                        
                          $createDataset(dataset)
                            .then(function(result){
                              logger.info("create "+result.metadata.dataset.id)
                              resolve(result);
                            })
                       
                      } else {
                          $makeHeadCommit(dataset,obj)
                            .then(function(){
                                $createDataset(dataset)
                                  .then(function(result){
                                    logger.info("update "+result.metadata.dataset.id)
                                    dataprocController.updateCache(result.metadata.dataset.id)
                                      .then(function(){
                                        resolve(result);
                                      })                                  
                                  })
                            })
                      }
                    }) 
        })
      }

      logger.info("Import dataset")
      var dataset = req.body;
      $updateDataset(dataset)
        .then(function(){
          logger.clear();
          return res.send("Dataset "+dataset.metadata.dataset.id+" imported successfully")
        })
       
  },


  updateDictionary: function(req,res){
    logger.info("Import dictionary")
     req.file('file')
      .upload({},function (err, uploadedFiles) {
          if (err) {
            return res.negotiate(err);
          }
          if (uploadedFiles.length === 0) {
            return res.badRequest('No file was uploaded');
          }

          var uploadedFileAbsolutePath = uploadedFiles[0].fd;
          logger.info("Parse file "+uploadedFileAbsolutePath);
          readJsonFile(uploadedFileAbsolutePath)
            .then(function(json){
              var list = json.data.list;
              logger.info("Import "+json.data.list.length+" keys from "+json.data.source+" downloaded at "+date.format(new Date(json.data.downloadedAt),"YYYY.MM.DD hh:mm:ss"))
              dictionaryController.updateDictionary(list)
                .then(function(){
                  var response = {
                    log: logger.success("Total: "+json.data.list.length+" dictionary keys updated").get()
                  }
                  logger.clear();
                  res.send(response)
                })
            })
      })            
  }
}


  // getNewDatasetId: function(req, res){
  //   var result = {id:uuid.v1()}
  //   return res.send(result)
  // },

  // createDataset: function (req, res) {
  //   sails.log.debug("#Create dataset");
  //   // sails.log.debug("Current User",req.user);
  //   Dictionary.find({}).then(function (json) {
  //     var dict = new query()
  //       .from(json)
  //       .map(function (item) {
  //         var tmp = item.toJSON();
  //         delete tmp.createdAt;
  //         delete tmp.updatedAt;
  //         delete tmp.id;
  //         return tmp;
  //       })
  //       .get();
  //     var file = uuid.v1();
  //     var dataset = converter.createDataset(file, dict);
  //     delete dataset.data;
  //     dict = dataset.dictionary;
  //     dataset.metadata.dataset.status = "private";
  //     dataset.metadata.dataset.commit.author = (req.user) ? req.user.name : "internal actor";
  //     // dictionaryController.updateDictionary(dict);
  //     delete dataset.dictionary;

  //     Dataset.create(dataset)
  //       .then(function (obj) {
  //         file += "(" + obj.id + ")";
  //         obj.dictionary = dict;
  //         res.setHeader('Content-disposition', 'attachment; filename=' + file + ".xlsx");
  //         res.setHeader('Content-type', mime.lookup(path.basename(file + ".xlsx")));
  //         return res.send(converter.buildXLS(prepareEmptyDataset(obj)));
  //       });
  //   }, function (err) {
  //     sails.log.error('Error while creating a new data set: ' + json + ' ' + err);
  //     res.serverError();
  //   });
  // },




  // updateDataset: function (req, res) {
  //   sails.log.debug("#Update dataset",logger);
  //   logger.info("Update dataset")
  //   req.file('file').upload({},
  //     function (err, uploadedFiles) {

  //       if (err) {
  //         return res.negotiate(err);
  //       }

  //       if (uploadedFiles.length === 0) {
  //         return res.badRequest('No file was uploaded');
  //       }

  //       var uploadedFileAbsolutePath = uploadedFiles[0].fd;

  //       logger.info("Parse file "+uploadedFileAbsolutePath)
    
  //       wdc_xlsx(uploadedFileAbsolutePath)
  //         .then(function(dataset){
  //           // logger.debug("dataset parsed")

  //           var dict = dataset.dictionary;
            
  //           var validationResult = dataset.validation;
  //           if (validationResult.error){
  //             validationResult.log = logger.get();
  //             logger.clear();
  //             return res.send(validationResult); 
  //           }

  //           dictionaryController.updateDictionary(dict)
  //           .then(function(){
  //             delete dataset.dictionary;
  //             dataset.metadata.dataset.commit.author = (req.user) ? req.user.name : "internal actor";;
  //             Dataset.findOne(
  //               {
  //                 "dataset/id": dataset.metadata.dataset.id,
  //                 "commit/HEAD": true
  //               }).then(function (obj) {
  //                 if (!obj) {
  //                   logger.info("Create new dataset")
  //                   Dataset.create(dataset, function (err, obj) {
  //                     if (err) {
  //                       sails.log.error('Error while adding new data source: ' + err);
  //                       return res.serverError();
  //                     } else {
  //                       // TODO send operation status
  //                       var result = prepareCommitInfo(obj);
  //                       result.warnings = validationResult.warnings;
  //                       Cache.clear("dsm")
  //                         .then(function(){
  //                           dataprocController.updateCache(result.metadata.dataset.id)
  //                             .then(function(){
  //                               return res.send(result);    
  //                             })
  //                         })
  //                     }
  //                   })
  //                 } else {
  //                   logger.info("Update dataset (create head commit)")
  //                   Dataset.destroy(
  //                     {
  //                       "dataset/id": dataset.metadata.dataset.id,
  //                       createdAt: {">=": obj.createdAt},
  //                       "commit/HEAD": false
  //                     }).then(function () {
  //                       Dataset.update({"dataset/id": dataset.metadata.dataset.id}, {"commit/HEAD": false})
  //                         .then(function () {
  //                           Dataset.create(dataset, function (err, obj) {
  //                             if (err) {
  //                               sails.log.error('Error while adding new data source: ' + err);
  //                               return res.serverError();
  //                             } else {
  //                               var result = prepareCommitInfo(obj);
  //                               result.warnings = validationResult.warnings;
                                
                            
  //                                   Cache.clear("dsm")
  //                                     .then(function(){
  //                                       logger.info("Update Cache")
  //                                       dataprocController.updateCache(result.metadata.dataset.id)
  //                                         .then(function(){
  //                                           logger.success("Operation Completed")
  //                                           result.log = logger.get();
  //                                           logger.clear();
  //                                           return res.send(result);    
  //                                       })

  //                                   })    
  //                             }
  //                           });
  //                         });
  //                     })
  //                 }
  //               }, function (err) {
  //                 sails.log.error('Error while updating a data set: ' + err);
  //                 res.serverError();
  //               })
  //             })

  //         })

  //       // var validationResult = converter.validate(uploadedFileAbsolutePath);
  //       // if(validationResult.error){
  //       //   return res.send(validationResult)
  //       // }

  //       // var dataset = converter.parseXLS(uploadedFileAbsolutePath);
  //       // var dict = dataset.dictionary;

  //       // dictionaryController.updateDictionary(dict);
  //       // delete dataset.dictionary;
  //       // dataset.metadata.dataset.commit.author = req.user.name;
  //       // Dataset.findOne(
  //       //   {
  //       //     "dataset/id": dataset.metadata.dataset.id,
  //       //     "commit/HEAD": true
  //       //   }).then(function (obj) {
  //       //     if (!obj) {
  //       //       Dataset.create(dataset, function (err, obj) {
  //       //         if (err) {
  //       //           sails.log.error('Error while adding new data source: ' + err);
  //       //           return res.serverError();
  //       //         } else {
  //       //           // TODO send operation status
  //       //           var result = prepareCommitInfo(obj);
  //       //           result.warnings = validationResult.warnings;
  //       //           Cache.clear("dsm")
  //       //             .then(function(){
  //       //               return res.send(result);    
  //       //             })
  //       //         }
  //       //       })
  //       //     } else {
  //       //       Dataset.destroy(
  //       //         {
  //       //           "dataset/id": dataset.metadata.dataset.id,
  //       //           createdAt: {">=": obj.createdAt},
  //       //           "commit/HEAD": false
  //       //         }).then(function () {
  //       //           Dataset.update({"dataset/id": dataset.metadata.dataset.id}, {"commit/HEAD": false})
  //       //             .then(function () {
  //       //               Dataset.create(dataset, function (err, obj) {
  //       //                 if (err) {
  //       //                   sails.log.error('Error while adding new data source: ' + err);
  //       //                   return res.serverError();
  //       //                 } else {
  //       //                   var result = prepareCommitInfo(obj);
  //       //                   result.warnings = validationResult.warnings;
  //       //                   Cache.clear("dsm")
  //       //                     .then(function(){
  //       //                       return res.send(result);    
  //       //                     })
  //       //                 }
  //       //               });
  //       //             });
  //       //         })
  //       //     }
  //       //   }, function (err) {
  //       //     sails.log.error('Error while updating a data set: ' + err);
  //       //     res.serverError();
  //       //   })
  //     });
  // },




  // updateChDatasetGroup: function (req, res) {

  //   // return res.send({data:{warnings:["Method updateChDatasetGroup overrided by stub"]}})
  //   logger.info("Update dataset group")
  //   var groupResult = [];
  //   var promises = [];
    
  //   var $createDataset = function(dataset){
  //     dataset["commit/HEAD"] = true;
  //     return Dataset
  //               .create(dataset)
  //               .then(function(obj){
  //                 var result = prepareCommitInfo(obj);
  //                  groupResult.push(result);
  //                  return result
  //               });
  //   }

  //   var $makeHeadCommit = function(dataset,obj){
  //       return new Promise(function(resolve){
  //         Dataset
  //               .destroy(
  //                 {
  //                   "dataset/id": dataset.metadata.dataset.id,
  //                   createdAt: {">=": obj.createdAt},
  //                   "commit/HEAD": false
  //                 })
  //               .then(function () {
  //                 Dataset
  //                         .update({"dataset/id": dataset.metadata.dataset.id}, {"commit/HEAD": false})
  //                         .then(function(obj){
  //                           resolve(obj)
  //                         })
  //               })
  //       })
  //   }

  //   var $updateDataset = function(dataset){
  //     return new Promise(function (resolve){
  //       Dataset
  //                 .findOne(
  //                   {
  //                     "dataset/id": dataset.metadata.dataset.id,
  //                     "commit/HEAD": true
  //                   })
  //                 .then(function (obj) {
  //                   if (!obj) {
                     
  //                       $createDataset(dataset)
  //                         .then(function(result){
  //                           resolve(result);
  //                         })
                     
  //                   } else {
  //                       $makeHeadCommit(dataset,obj)
  //                         .then(function(){
  //                             $createDataset(dataset)
  //                               .then(function(result){
  //                                 dataprocController.updateCache(result.metadata.dataset.id)
  //                                   .then(function(){
  //                                     resolve(result);
  //                                   })                                  
  //                               })
  //                         })
  //                   }
  //                 }) 
  //     })
  //   }


  //   sails.log.debug("#Update dataset group");
  //   req.file('file').upload({},
  //     function (err, uploadedFiles) {

  //       if (err) {
  //         return res.negotiate(err);
  //       }

  //       if (uploadedFiles.length === 0) {
  //         return res.badRequest('No file was uploaded');
  //       }

  //       var uploadedFileAbsolutePath = uploadedFiles[0].fd;

  //       logger.info("Process file "+ uploadedFileAbsolutePath)

  //       ch_datasetGroupParser(uploadedFileAbsolutePath)
  //         .then(function(datasetGroup){
  //           datasetGroup.forEach(function(dataset,index){
  //             var dict = dataset.dictionary;
  //             dictionaryController.updateDictionary(dict)
  //               .then(function(){
  //                 delete dataset.dictionary;
  //                 dataset.metadata.dataset.commit.author = (req.user) ? req.user.name : "internal actor";
  //                 logger.info("Create or update dataset "+dataset.metadata.dataset.id)
  //                 promises.push($updateDataset(dataset));
  //              })
  //           }); // datasetGroup.forEach
            
  //           Promise.all(promises)
  //             .then(function(){
  //               Cache.clear("dsm")
  //                       .then(function(){
  //                         logger.success("Operation completed")
  //                         var sendedObj = {
  //                           log: logger.get(),
  //                           result:groupResult
  //                         }
  //                         logger.clear();
  //                         return res.send(sendedObj)    
  //                       })
  //             })
  //         })
  //     });
  // },



  // // updateChDatasetGroup: function (req, res) {
  // //   sails.log.debug("#Update dataset group");
  // //   req.file('file').upload({},
  // //     function (err, uploadedFiles) {

  // //       if (err) {
  // //         return res.negotiate(err);
  // //       }

  // //       if (uploadedFiles.length === 0) {
  // //         return res.badRequest('No file was uploaded');
  // //       }

  // //       var uploadedFileAbsolutePath = uploadedFiles[0].fd;

  // //        ch_datasetGroupParser(uploadedFileAbsolutePath)
  // //         .then(function(datasetGroup){
  // //           // sails.log.debug(dataset)
            
  // //           var promises = [];
  // //           groupResult = [];
  // //           // return res.send(datasetGroup)

  // //           datasetGroup.forEach(function(dataset){

  // //             var dict = dataset.dictionary;
              
  // //             var validationResult = dataset.validation;
  // //             if (validationResult.error){
  // //               return res.send(validationResult); 
  // //             }

  // //             dictionaryController.updateDictionary(dict);
  // //             delete dataset.dictionary;
  // //             dataset.metadata.dataset.commit.author = (req.user) ? req.user.name : "internal actor";
  // //             promises.push(
  // //               Dataset.findOne(
  // //               {
  // //                 "dataset/id": dataset.metadata.dataset.id,
  // //                 "commit/HEAD": true
  // //               }).then(function (obj) {
  // //                 if (!obj) {
  // //                   Dataset.create(dataset, function (err, obj) {
  // //                     if (err) {
  // //                       sails.log.error('Error while adding new data source: ' + err);
  // //                       return res.serverError();
  // //                     } else {
  // //                       // TODO send operation status
  // //                       var result = prepareCommitInfo(obj);
  // //                       result.warnings = validationResult.warnings;
  // //                       Cache.clear("dsm")
  // //                         .then(function(){
  // //                           groupResult.push(result);
  // //                           // return res.send(result);    
  // //                         })
  // //                     }
  // //                   })
  // //                 } else {
  // //                   Dataset.destroy(
  // //                     {
  // //                       "dataset/id": dataset.metadata.dataset.id,
  // //                       createdAt: {">=": obj.createdAt},
  // //                       "commit/HEAD": false
  // //                     }).then(function () {
  // //                       Dataset.update({"dataset/id": dataset.metadata.dataset.id}, {"commit/HEAD": false})
  // //                         .then(function () {
  // //                           Dataset.create(dataset, function (err, obj) {
  // //                             if (err) {
  // //                               sails.log.error('Error while adding new data source: ' + err);
  // //                               return res.serverError();
  // //                             } else {
  // //                               var result = prepareCommitInfo(obj);
  // //                               result.warnings = validationResult.warnings;
  // //                               Cache.clear("dsm")
  // //                                 .then(function(){
  // //                                   groupResult.push(result);
  // //                                   // return res.send(result);    
  // //                                 })
  // //                             }
  // //                           });
  // //                         });
  // //                     })
  // //                 }
  // //               }, function (err) {
  // //                 sails.log.error('Error while updating a data set: ' + err);
  // //                 res.serverError();
  // //               })
  // //             ) //promises push
  // //           }) // datasetGroup.forEach
            
  // //           Promise.all(promises)
  // //             .then(function(){
  // //               console.log(promises)
  // //               return res.send(groupResult)
  // //             })
  // //         })
  // //     });
  // // },



  // // createTimeline: function (req, res) {
  // //   sails.log.debug("#createTimeline");
  // //   req.file('file').upload({},
  // //     function (err, uploadedFiles) {

  // //       if (err) {
  // //         return res.negotiate(err);
  // //       }

  // //       if (uploadedFiles.length === 0) {
  // //         return res.badRequest('No file was uploaded');
  // //       }

  // //       var uploadedFileAbsolutePath = uploadedFiles[0].fd;
  // //       var dataset = converter.parseXLSTimeline(uploadedFileAbsolutePath)
  // //       var result = prepareTimeline(dataset.data,"","",dataset.metadata.timeDomain);
  // //       var obj_to_save = {
  // //           value: result,
  // //         };
          
  // //       ProcData
  // //         .create(obj_to_save)
  // //         .then(function(obj){
  // //           ProcData.findOne({id:obj.id})
  // //           .then(function(founded){
  // //             return res.json(founded)
  // //           })
  // //           // return res.json(obj);
  // //         })
  // //     })  
  // // },

 
  

  // downloadDataset: function (req, res) {
  //   sails.log.debug("downloadDataset");
  //   var datasetID = req.params.datasetID;
  //   Dataset.findOne({
  //     "dataset/id": datasetID,
  //     "commit/HEAD": true
  //   }).then(function (obj) {
  //     Dictionary.find({}).then(function (json) {
  //       var dict = new query()
  //         .from(json)
  //         .map(function (item) {
  //           var tmp = item.toJSON();
  //           delete tmp.createdAt;
  //           delete tmp.updatedAt;
  //           delete tmp.id;
  //           return tmp;
  //         })
  //         .get();
  //       obj = prepareDataset(obj);
  //       obj.dictionary = dict;
  //       var file = obj.metadata.dataset.id + "(" + obj.id + ").xlsx";
  //       res.setHeader('Content-disposition', 'attachment; filename=' + file);
  //       res.setHeader('Content-type', mime.lookup(path.basename(file)));
  //       return res.send(converter.buildXLS(obj));
  //     });
  //   }, function (err) {
  //     sails.log.error('Error while downloading a data set by id: ' + datasetID + ' ' + err);
  //     res.serverError();
  //   });
  // },


  // getQueryResult: function(req,resp){
  //    sails.log.debug("#getQueryResult");
  //   var params = req.body;
  //   sails.log.debug(params)
  //   if(!params){return resp.serverError();}
  //   var commitID = params.commitID;
  //   var query = params.query;
  //   var locale = (params.locale === "uk") ? "ua" : params.locale; //|| "en";
  //   // find dataset
  //   // sails.log.debug(params)
  //   Dataset.findOne({ 
  //     "id":commitID
  //   }).then(function(obj){
  //     if(!obj){return resp.serverError();}
  //     //execute query
      
  //     // get dictionary and translate query result
  //     Dictionary.find({}).then(function(json){
  //         i18n = new I18N(json);
  //         obj.data = i18n.translate(obj.data,locale);
  //         obj.metadata = i18n.translate(obj.metadata,locale);
          
  //         for(i in obj.metadata.dimension){
  //         //   if(obj.metadata.dimension[i].role == "time"){
  //         //     obj.metadata.dimension[i].values = obj.metadata.dimension[i].values.map(function(item){
  //         //       sails.log.debug(item,obj.metadata.dimension[i].format, new Date(item.label));
  //         //       return {id:item.id, label : date.format(new Date(item.label),obj.metadata.dimension[i].format)}
  //         //     })
  //         //     // sails.log.debug(obj.metadata.dimension[i].values);
  //         //     // obj.metadata.dimension[i].values = date.format(obj.metadata.dimension[i].values,obj.metadata.dimension[i].format)
  //         //   }else{
  //             obj.metadata.dimension[i].values = 
  //             i18n.translate(obj.metadata.dimension[i].values,locale)  
  //           // }
  //           obj.metadata.dimension[i].label = i18n.translate(obj.metadata.dimension[i].label,locale);
            
  //         } 

  //         // obj.metadata = i18n.translate(obj.metadata,locale);
          
  //         var result = executeQuery(obj,query);

  //         result.metadata = {
  //           type : "Query Result Table",
  //           source : obj.metadata,
  //           selection : query
  //         }

  //         Table.create({data:result}).then(function (obj){
  //           result.id = obj.id;
  //           result.createdAt = obj.createdAt;
  //           return resp.send(result);  
  //         });
          
  //     });          
  //   });  
  // }
// };