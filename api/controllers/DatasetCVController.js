/**
 * DatasetCVController
 *
 * @description :: Server-side logic for Datasets Control Version Service
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var converter = require("../../wdc_libs/wdc-xlsx-converter");
var mime = require('mime');
var path = require('path');
var uuid = require('uuid');
var Cache = require("./Cache");
var dataprocController = require("./DataProcController");
var date = require("date-and-time");

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

module.exports = {
  getCommitList: function (req, res) {
    sails.log.debug("#getCommitList"); 
    Dataset.find({"dataset/id": req.params.datasetID}).then(function (obj) {
      obj = new query()
        .from(obj)
        .orderBy(
          query.criteria.Date["Z-A"](function(item){return item.createdAt})
        //   function (a, b) {
        //   return a.createdAt < b.createdAt
        // }
        )
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
    sails.log.debug("#setHead"); 
    var commitID = req.params.commitID;
    Dataset.findOne({id: commitID}).then(function (obj) {
      var datasetID = obj["dataset/id"];
      Dataset.update({"dataset/id": datasetID}, {"commit/HEAD": false})
        .then(function () {
          Dataset.update({id: commitID}, {"commit/HEAD": true})
            .then(function (obj) {
              Cache.clear("dsm")
                .then(function(){
                  dataprocController.updateCache(obj[0].metadata.dataset.id)
                    .then(function(){
                      return res.send(prepareCommitInfo(obj[0]));    
                    })
                })
            })
        })
    }, function (err) {
      sails.log.error('Error while setting a gead commit: ' + err);
      res.serverError();
    })
  },

  downloadCommit: function (req, res) {
    sails.log.debug("#downloadCommit");
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
    sails.log.debug("#deleteCommit");
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
  
  setStatus: function (commitID, status) {
    sails.log.debug("#setStatus");
    // sails.log.debug("Commit",commitID)
           return Dataset.update({"id": commitID}, {"dataset/status": status});
  },

  setPublicStatus: function (req, res) {
    sails.log.debug("#setPublicStatus");
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
     sails.log.debug("#setPrivateStatus");
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
  }
};

