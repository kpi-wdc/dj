/**
 * TimelineController
 *
 * @description :: Server-side logic for managing Timelines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var wdc_timeline =  require("../../wdc_libs/parsers/wdc-timeline");
var Cache = require("./Cache");
// var uuid = require('uuid');
var util = require("util");

module.exports = {


  upload: function (req, res) {
    
    req.file('file').upload({},
      function (err, uploadedFiles) {

        if (err) {
          return res.negotiate(err);
        }

        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var uploadedFileAbsolutePath = uploadedFiles[0].fd;
        
        wdc_timeline(uploadedFileAbsolutePath)
          .then(function(data){
              data.metadata.dataset.id =  (data.metadata.dataset.id) ? data.metadata.dataset.id : require('uuid').v1();
              Cache
                // .save("timeline",uploadedFiles[0].fd+uploadedFiles[0].size,data)
                .save("timeline", data.metadata.dataset.id, data)
                .then(function(obj){
                      console.log(" from cache "+ obj.length)
                      var response = (util.isArray(obj)) ? obj[0] : obj;
                      return res.json(response)
                })
            })    
    })          
  },

  get: function(req,resp){
    var id = req.params.id;
    Cache.getById(id)
      .then(function(r){
        return resp.send(r)    
      })
  }

};

