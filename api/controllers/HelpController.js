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
        fs.stat(path, function(error, stats) {
          fs.open(path, "r", function(error, fd) {
            var buffer = new Buffer(stats.size);

            fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
              var data = buffer.toString("utf8", 0, buffer.length);
              res.send(data);
              fs.close(fd);
            });
          });
        });
      }
    });
  }
};
