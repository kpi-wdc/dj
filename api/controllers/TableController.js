/**
 * TableController
 *
 * @description :: Server-side logic for Cached Tables 
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var mime = require('mime');
var path = require('path');
var toXLS = require("../../wdc_libs/wdc-table-generator").prepareXLS;




module.exports = {

  
  downloadTable: function(req,res){
    sails.log.debug("#downloadTable");
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
    sails.log.debug("#deleteTable");
     var tableID = req.params.tableID;
     // sails.log("Delete table", tableID);
     Table.destroy({id:tableID}).then(function(){
        res.ok();
     })
  },

  getAllTables: function(req,resp){
    sails.log.debug("#getAllTables");
    Table.find({}).then(function(obj){return resp.send(obj)})
  }

};

