/**
 * DictionaryController
 *
 * @description :: Server-side logic for managing Dictionary
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

converter = require("../../wdc_libs/wdc-xlsx-converter");
mime = require('mime');
path = require('path');
uuid = require('uuid');
query = require('../../wdc_libs/wdc-query');

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
    var promises = [];
    dictionary.forEach(function (item) {
      Dictionary.find({key: item.key}).then(function (result) {
        if (result.length == 0) {
          Dictionary.create(item).then(function (r) {
            ;
          }, function (err) {
            sails.log.error('Error while creating dictionary' + err);
            res.serverError();
          });
        } else {
          Dictionary.update({key: item.key}, item).then(function (r) {
            ;
          }, function (err) {
            sails.log.error('Error while updating dictionary' + err);
            res.serverError();
          });
        }
      });
    });
  },

  uploadDictionary: function (req, res) {
    req.file('file').upload({},
      function (err, uploadedFiles) {
        if (err) {
          return res.negotiate(err);
        }
        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var uploadedFileAbsolutePath = uploadedFiles[0].fd;
        var dictionary = converter.parseXLS(uploadedFileAbsolutePath).dictionary;
        module.exports.updateDictionary(dictionary);
        return res.send({status: "ok"})
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

