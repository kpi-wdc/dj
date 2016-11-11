/**
 * DictionaryController
 *
 * @description :: Server-side logic for managing Dictionary
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var converter = require("../../wdc_libs/wdc-xlsx-converter");
var mime = require('mime');
var path = require('path');
var uuid = require('uuid');
var query = require('../../wdc_libs/wdc-query');
var Promise = require("bluebird");
var logger = require("../../wdc_libs/wdc-log").global;


module.exports = {

  getDictionary: function (req, res) {
    // get req.params.type as array of string
    // fetch data from dictionary collection where type in req.params.type array
    // if req.params.type is undefined or req.params.type == [] fetch all data
    // send fetched data

    dictionaryTypes = req.params.type;
    if (!dictionaryTypes) {
      return res.badRequest('Request contains no type');
    }

    Dictionary.find({
      'value.type': dictionaryTypes
    }).then(function (json) {
      if (json) {
        return res.send(json);
      } else {
        return res.send([]);
      }
    }, function (err) {
      sails.log.error('Error while getting a dictionary of types: ' + dictionaryTypes + err);
      res.serverError();
    });
  },

  getAllDictionaries: function (req, res) {
    Dictionary.find({}).then(function (json) {
      return res.send(json);
    }, function (err) {
      sails.log.error('Error while getting all dictionaries' + err);
      res.serverError();
    });
  },

  updateDictionary: function (dictionary) {
    // console.log("Update dictionary", dictionary)
    var promises = [];
    var d = new query()
          .from(dictionary)
          .group(function(item){return {key:item.key, value:item} })
          .get();
    
    d.forEach(function(item){
      if(item.values.length>1){
        logger.warning("Key duplication: "+item.key)
      }
    })
    
    d
      .map(function(item){
        return {key:item.key, type:item.values[0].type, value:item.values[0].value}
      })
      .forEach(function (item) {
       promises.push(new Promise(function(resolve){
          Dictionary.find({key: item.key}).then(function (result) {
            if (result.length == 0) {
              Dictionary.create(item).then(function (r) {
                logger.info("create "+r.type+": "+r.key);
                resolve(r);
              }, function (err) {
                logger.error(err)
                resolve()
                // sails.log.error('Error while creating dictionary' + err);
                // res.serverError();
              });
            } else {
              Dictionary.update({key: item.key}, item).then(function (r) {
                logger.info("update "+r[0].type+": "+r[0].key);
                resolve(r);
              }, function (err) {
                logger.error(err)
                resolve()
                // sails.log.error('Error while updating dictionary' + err);
                // res.serverError();
              });
            }
          })
        })
      );
    });
    return Promise.all(promises)
  },

  uploadDictionary: function (req, res) {
    logger.info("Start upload dictionary operation")
    req.file('file').upload({},
      function (err, uploadedFiles) {
        if (err) {
          return res.negotiate(err);
        }
        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var uploadedFileAbsolutePath = uploadedFiles[0].fd;
        logger.info("Parse file: "+uploadedFileAbsolutePath)
        var dictionary = converter.parseDictionary(uploadedFileAbsolutePath);
        logger.info(dictionary.length + " items parsed")
        module.exports.updateDictionary(dictionary)
          .then(function(){
            logger.success("Operation Complete")
            var response = {log:logger.get()}
            logger.clear();
            return res.send(response)    
          });
        
      });
  },

  downloadDictionary: function (req, res) {
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

      file = "dictionary";
      res.setHeader('Content-disposition', 'attachment; filename=' + file + ".xlsx");
      res.setHeader('Content-type', mime.lookup(path.basename(file + ".xlsx")));
      return res.send(converter.buildXLS({dictionary: dict}));
    }, function (err) {
      sails.log.error('Error while getting a dictionary' + err);
      res.serverError();
    })
  }

};

