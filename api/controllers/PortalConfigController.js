/**
 * PortalConfigController
 *
 * @description :: Server-side logic for managing portal config
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require("fs");
var path = require("path");

module.exports = {
  
  getConfig: function (req, res) {
    PortalConfig.find({})
      .then(function(config) {
        return res.send(config[0].value)
      }, function (err) {
        sails.log.error('Portal config not avaible '+ err);
        res.serverError();
    });
  },

  setConfig: function(req,res){
    var config = req.body.config;
    PortalConfig.update({},{value:config})
      .then(function(updatedConfig){
        return res.send(updatedConfig[0].value)
      })
  },

  getSkins:function(req,res){
    return res.ok(
        fs
          .readdirSync("./assets/skins/")
          .map(function(file){
            return path.parse(file).name;
          })
    )
  }

};
