/**
 * DataProcController
 *
 * @description :: Server-side logic for managing data processes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var executeQuery = require("../../wdc_libs/wdc-table-generator").prepare;
var I18N = require("../../wdc_libs/wdc-i18n");
var util = require("util");


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

module.exports = {
  /**
   * `DataProcController.process()`
   */
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
  }
};

