/**
 * DatasetController
 *
 * @description :: Server-side logic for managing Datasets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

converter = require("wdc-xlsx-converter");

mime = require('mime');
path = require('path');
uuid = require('uuid');


module.exports = {

  createDataset: function(req, res) {
      // get all dictionary collection
      // generate new dataset ID
      // call converter.createDataset()
      // set metadata props
      // set commit.author prop
      // create initial commit as HEAD
      // send xlsx file converter.buildXLS() or converter.saveXLS()
      file = uuid.v1();
      res.setHeader('Content-disposition', 'attachment; filename=' + file+".xlsx");
      res.setHeader('Content-type', mime.lookup(path.basename(file+".xlsx")));
      return res.send(converter.buildXLS(converter.createDataset(file,[])));
  },

  updateDataset: function(req, res) {
    // get uploaded files
    // for each file call converter.parseXlS()
    // update dictionary collection
    // remove distionary from dataset
    // remove unused commits
    // create commit as HEAD
    // send operation status
    // 
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
        return res.send(dataset);
      });
  },

  getMetadataList: function(req, res) {
    // get req.params.filter as array such as [
    // {'metadata_key': [#key1','#key2',...] },
    // {'metadata_key': [#key1','#key2',...] },
    // ...]
    // for example  - {
    //                  "metadata.dataset.source" : ["#WB"],
    //                  "metadata.dataset.topics[]" : ["#GDP","#WDI/#EC/#GDP"]
    //                }
    // can use module flat (wdc_libs) for object transforms
    // fetch metadata field from dataset collection (use only HEAD commits)
    // send this list
  },

  getCommitList: function(req, res) {
    // get req.params.datasetID
    // fetch metadata.dataset.commit field from dataset collection where metadata.dataset.id == datasetID
    // order desc by commit.date
    // send this list
  },

  setHead: function(req, res) {
    // get req.params.commitID
    // get commit by commitID and get datasetID
    // find HEAD commit for datasetID
    // update this commit set status in noHEAD
    // update commit with commitID set status in HEAD
    // send operation status
  },

  getDataset: function(req, res) {
    // get req.commitID
    // find dataset and send this
  },

  downloadDataset: function(req, res) {
    // get req.params.commitID
    // get all dictionary collection
    // find dataset and append dictionary
    // convert dataset to xlsx
    // send file
  },

  getTopicTree: function(req, res) {
    // get all datasets metadata where topics contains classification pathes
    // call query for tree extraction
    // send tree
  }

};

