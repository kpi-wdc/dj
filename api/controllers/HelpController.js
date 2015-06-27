/**
 * HelpController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');

module.exports = {
  getHelp: function(req, res) {
    const widgetType = req.params.widgetType;
    const targetLanguage = req.params.lang;
    const path =  sails.config.appPath + '/.tmp/public/widgets/'
      + widgetType + '/help/' + targetLanguage + '.html';
    fs.exists(path, function(exists){
      if(!exists){
        res.notFound(path);
      } else {
        fs.readFile(path, {
          encoding: 'utf-8'
        }, function (err, data) {
          if (err) sails.log.error('Error reading file: ' + path);
          else return res.send(data);
        });
      }
    });
  }
};
