/**
 * AppConfigController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  _config: { actions: true, rest: false, shortcuts: false },

  get: function (req, res) {
    var fs = require('fs');
    fs.readFile('.tmp/public/index.html', function (err, contents) {
      res.set('Content-Type', 'text/html');
      res.send(contents);
    });
  }
};

