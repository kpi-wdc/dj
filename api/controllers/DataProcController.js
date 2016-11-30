/**
 * DataProcController
 *
 * @description :: Server-side logic for managing data processes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var executeQuery = require("../../wdc_libs/wdc-table-generator").prepare;
var I18N = require("../../wdc_libs/wdc-i18n");
var util = require("util");
var Query = require("../../wdc_libs/wdc-query-async");
var dataProcess = require("../../wdc_libs/data-processing");
var Cache = require("./Cache");
var Promise = require("bluebird");
var flat = require("../../wdc_libs/wdc-flat");
var logger = require("../../wdc_libs/wdc-log").global;


var getQueryResult = function(query,proc,proc_params){
    //sails.log.debug(query);
    var params = query;
    if(!params){return null}
    var commitID = params.commitID;
    var query = params.query;
    var locale = (params.locale === "uk") ? "ua" : params.locale; //|| "en";
    // find dataset
    // sails.log.debug(params)
    Dataset.findOne({ 
      "id":commitID
    }).then(function(obj){
      if(!obj){return null}
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

          result.createdAt = obj.createdAt;
          // sails.log.debug(result);
          //   obj_to_process.data = data;//req.body.data;
        //   sails.log.debug("RESULT ",obj_to_process.data);
        //   obj_to_process.params = req.body.params;
          proc.send({data:result,'params':proc_params});  
      });          
    }); 
  };

var translateQueryResult = function(obj,locale){
 var r = new Promise(
    function(resolve){
      Dictionary
            .find({})
            .then(function(json){
              i18n = new I18N(json);
              obj = i18n.translate(obj,locale);
              resolve(obj);
            })
      }) 
  return r;            
}

var prepareCachedResult = function(d){
  d = (util.isArray(d))? d[0] : d;
  d = d || {};
  return {
    data: d.value,
    data_id: d.id,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  }
}

var _extend = function(obj,ext){
  for(var key in ext){
    obj[key] = ext[key]
  }
  return obj;
} 

module.exports = {
  /**
   * `DataProcController.process()`
   */
  


  process1: function(req, res){
      // Cache
      //   .get(req.body)
      //   .then(function(cached){
      //     if(cached){
      //        return res.send(cached.value);
      //     }else{
            if (req.body.data_query){
               Dataset.findOne({"dataset/id": req.body.data_query.datasetID, "commit/HEAD": true})
               .then(function(dataset){
                  if(dataset) {
                    dataProcess(dataset, {query: req.body.data_query.query})
                      .then(function(dpr){
                        var locale = (req.body.data_query.locale === "uk") ? "ua" : req.body.data_query.locale;
                        translateQueryResult(dpr,locale)
                          .then(function(dpr){
                            var params = {
                              dataset: req.body.data_query.datasetID,
                              script : {query: req.body.data_query.query},
                              locale : locale
                            }
                            dpr.dataset = req.body.data_query.datasetID
                            Cache
                              .save("process",req.body,dpr,params)
                              .then(function(result){
                                return res.send(prepareCachedResult(result))
                              })
                          })  
                      })
                  }else{
                    return res.badRequest('Cannot query data');
                  }    
               }) 
            }else{
              if(req.body.data_id) {
                Cache
                  .getById(req.body.data_id)
                  .then(function(cached){
                      var data = [];
                      var parent = [];
                      if(util.isArray(cached)){
                        req.body.data_id.forEach(function(item){
                          parent.push(item)
                          data.push(
                            cached
                              .filter(function(d){return d.id == item})[0].value
                          )
                        }) 
                      }else{
                        data = cached.value;
                        parent = req.body.data_id;
                      }

                      var p = req.body.params;

                      if(req.body.proc_name == "scatter-serie"){
                        p.serie = "scatter";
                      }

                      if(req.body.proc_name == "line-serie"){
                        p.serie = "line";
                      }

                      if(req.body.proc_name == "barchartserie"){
                        p.serie = "bar";
                      }

                      if(req.body.proc_name == "corr-matrix"){
                        p.serie = "deps";
                      }

                       if(req.body.proc_name == "geochart-serie"){
                        p.serie = "geojson";
                      }

                      dataProcess(data,p)
                        .then(function(result){
                          var params = {
                            parent: parent,
                            dataset: (data.forEach) ?data[0].dataset : data.dataset,
                            script: result.postProcess
                          }
                          result.parent = parent;
                          result.dataset = (data.forEach) ?data[0].dataset : data.dataset
                          Cache
                          .save("process",req.body,result,params)
                          .then(function(result){
                            res.send(prepareCachedResult(result))
                          })
                        })
                  })
              }  
            }
        //   }
        // })
  }, 


  process: function (req, res) {
    var tempObj = req.body;
    sails.log.debug("REQUEST", req.body);
    var needToHash = req.body.cache !== false;

    function prepareResponse(req, res) {
      var obj_to_process = {};
      var launchingFilePath = sails.config.executables[req.body.proc_name];
      var child = require('child_process').fork(launchingFilePath, [], {silent: true});
      var parent_proc = "";
      if (req.body.data_query) {
        getQueryResult(req.body.data_query, child, req.body.params);
        // .then(function(data){
        //   obj_to_process.data = data;//req.body.data;
        //   sails.log.debug("RESULT ",obj_to_process.data);
        //   obj_to_process.params = req.body.params;
        //   child.send(obj_to_process);  
        // })
        
      } else if (req.body.data_id) {
        

        (function(dataID){
          if(util.isArray(dataID)) return ProcData.findByIdIn(dataID)
          return  ProcData.findOneById(dataID) 
        })(req.body.data_id)
        .then( function(found){
          if (found) {
              if (found.isDataSource) {
                obj_to_process = found;
                obj_to_process.params = req.body.params;
              } else {

                if(util.isArray(found)){
                  obj_to_process.data = [];
                  req.body.data_id.forEach(function(item){
                    obj_to_process.data.push(
                      found.filter(function(d){return d.id == item})[0].value
                    )
                  }) 
                }else{
                  obj_to_process.data = found.value;
                }

                obj_to_process.params = req.body.params;
              

              }
              parent_proc = found.id;
              child.send(obj_to_process);
            } else {
              return res.forbidden('No data was found for the specified id: ' + req.body.data_id);
            }
        })  



        // ProcData.findOne({
        //   id: req.body.data_id
        // }, 
        // function (err, found) {
        //   if (!err) {
        //     if (found) {
        //       if (found.isDataSource) {
        //         obj_to_process = found;
        //         obj_to_process.params = req.body.params;
        //       } else {
        //         obj_to_process.data = found.value;
        //         obj_to_process.params = req.body.params;
        //       }
        //       parent_proc = found.id;
        //       child.send(obj_to_process);
        //     } else {
        //       return res.forbidden('No data was found for the specified id: ' + req.body.data_id);
        //     }
        //   } else {
        //     return res.serverError();
        //   }
        // })





      } else {
        return res.badRequest('Request must contain either data or data_id field');
      }

      var res_body = {};
      var err_body = {};
      child.on('message', function(msg) {
        res_body.data = msg;
      });

      child.stderr.on('data', function(err) {
        err_body.err = err.toString();
      });

      child.on('close', function(code) {
        if (code == 0) {
          res_body.status_code = code;
          sails.log.debug('Child Process return code: ' + code);
          // save result to DB
          var obj_to_save = {
            value: res_body.data,
            parent: parent_proc,
            hash: md5,
            createdAt: obj_to_process.createdAt
          };
          if (req.body.cache === false) {
            delete obj_to_save.hash;
          }
          ProcData.create(obj_to_save, function (err, obj) {
            if (err) {
              sails.log.error('Error while processing proc request: ' + err.toString());
              return res.serverError();
            } else {
              res_body.data_id = obj.id;
              res_body.createdAt = obj.createdAt;
              res_body.updatedAt = obj.updatedAt;
              if (parent_proc) {
                res_body.parent = parent_proc;
              }
              if (req.body.response_type === 'data_id') {
                delete res_body.data;
              }
              return res.json(res_body);
            }
          });
        } else {
          err_body.status_code = code;
          sails.log.debug('Error while processing request: ' + err_body);
          return res.badRequest(err_body);
        }
      });
    }

    if (needToHash) {
      // response type doesn't matter - we compute every time
      delete tempObj.response_type;
      // caching property shouldn't matter either
      delete tempObj.cache;
      var md5 = require('object-hash').MD5(tempObj);

      ProcData.findOneByHash(md5).then(function (json) {
        // json, corresponding to md5 hash of the request already
        // exists in the database, so there is no need to process it
        // again, just send back previous computational result
        if (json) {
          if (!json.parent) {
            delete json.parent;
          }
          json.data = json.value;
          delete json.value;
          if (req.body.response_type === 'data_id') {
            delete json.data;
          }
          delete json.hash;
          json.data_id = json.id;
          delete json.id;
          json.status_code = 0;
          return res.send(json);
        } else {
          prepareResponse(req, res);
        }
      });
    } else {
      prepareResponse(req, res);
    }
  },


  


  /**
   * `DataProcController.getById()`
   *  Gets a data by its id
   */
  getById: function (req, res) {
    ProcData.findOneById(req.params.dataId)
      .then(function (found) {
        if (found) {
          if (!found.parent) delete found.parent;
          delete found.hash;
          res.json(found);
        } else {
          res.forbidden();
        }
      }, function (err) {
        res.negotiate(err);
      });
  },

   /**
   *  Gets a data by its id
   */
  getById1: function (req, res) {

    Cache.getById(req.params.dataId)
      .then(function (result) {
        if (result) {
          res.send(result)
        } else {
          res.forbidden();
        }
      }, function (err) {
        res.negotiate(err);
      });
  },


  updateCache:function(dataset){
    // console.log("Update cache for ",dataset)
    logger.info("Update cache for ",dataset)

    var processed = {};
    var promises = [];
    
    var process = function(cacheTree, cacheItem){
      // console.log("Process "+cacheItem)
      if(processed[cacheItem.id]) return processed[cacheItem.id];

      return  new Promise(function(resolve){
          if(cacheItem.parent !== undefined){
            cacheItem.parent = (cacheItem.parent.forEach)? cacheItem.parent:[cacheItem.parent];
            var promises = [];
            cacheItem.parent.forEach(function(parent){
              var child = cacheTree.filter(function(c){return c.id == parent})[0];
              if(child){
                 var p = process(cacheTree,cacheTree.filter(function(c){return c.id == parent})[0])
                 promises.push(p);
                 processed[parent] = p;
              } 
            })
            Promise.all(promises).then(function(){
              logger.info("resolve script: "+ cacheItem.id + " parent: " + cacheItem.parent)

              Cache
                  .getById(cacheItem.parent)
                  .then(function(cached){
                      var data = [];
                      if(util.isArray(cached) && cached.length >1){
                        cacheItem.parent.forEach(function(item){
                          data.push(
                            cached
                              .filter(function(d){return d.id == item})[0].value
                          )
                        }) 
                      }else{
                        data = cached[0].value;
                      }

                      
                      dataProcess(data, {script:cacheItem.postProcess})
                        .then(function(result){
                          Cache
                          .update(cacheItem.id,result)
                          .then(function(result){
                             resolve(cacheItem)
                          })
                        })
                  })
            })
          }else{
            logger.info("resolve query: ", cacheItem.id)


            Dataset.findOne({"dataset/id": cacheItem.dataset, "commit/HEAD": true})
               .then(function(dataset){
                  if(dataset) {
                    dataProcess(dataset, {script:cacheItem.postProcess})
                      .then(function(dpr){
                        var locale = (cacheItem.locale === "uk") ? "ua" : cacheItem.locale;
                        translateQueryResult(dpr,locale)
                          .then(function(dpr){
                            dpr.dataset = cacheItem.dataset
                            Cache
                              .update(cacheItem.id, dpr)
                              .then(function(result){
                                resolve(cacheItem)
                              })
                          })  
                      })
                  } 
               }) 
          }  
      })
    }

    return new Promise(function(resolve){
      Cache.list()
        .then(function(collection){
          new Query()
              .from(collection)
              .select(function(item){
                if(item.tag != "process") return false;
                if(!item.params) return false;
                return item.params.dataset == dataset
              })
              .map(function(item){
                return {
                  id: item.id,
                  parent: (item.params.parent) ? item.params.parent : undefined,
                  dataset: item.params.dataset,
                  postProcess: item.params.script,
                  locale: item.params.locale
                }
              })
              .then(function(result){
                result.forEach(function(item){
                  var p = process(result,item);
                  promises.push(p)
                  processed[item.id] = p;
                })
                  
                Promise.all(promises).then(function(){resolve(promises)})
              })
        })  
    })  
  },

  /**
   *  `DataProcController.updateProcData(<procdata item id>)`
   *  Updates process result after update datasets
   */
  
  updateProcData: function(req,resp){
    
    var id = req.params.id;
    var locale = req.params.locale;
    this.updateCache(id)
        .then(function(){
          resp.send({result:"ok"})
        })

  },


  runScript : function(req,resp){
    // logger.debug("Script "+ JSON.stringify(req.body))
    var str = req.body.data;
    var parsed = require("../../wdc_libs/data-processing/script/parser").parse(str);
    // logger.debug("Parsed "+ JSON.stringify(parsed))
    var source = parsed.source;
    var script = parsed.script;

    
    
    var apply = function(data,script){
      // logger.debug("Apply "+data+" "+script)
      dataProcess(data,{script:script})
            .then(function(result){
              // var params = {
              //   dataset: source.dataset,
              //   script: result.postProcess
              // }
              result.dataset = source.dataset
              // result.postProcess
              resp.send(result)
              // Cache
              // .save("process",req.body,result,params)
              // .then(function(result){
                // resp.send(prepareCachedResult(result))
              // })
      })
    }

    if(source.dataset){
      Dataset.findOne({"dataset/id": source.dataset, "commit/HEAD": true})
       .then(function(dataset){
          logger.debug("Fetch dataset "+dataset)
          apply(dataset,script)
        }) 
    }else{
      Cache
        .getById(source.table)
        .then(function(cached){
          apply(cached, script)
        })  
    }
  }



};//eof

