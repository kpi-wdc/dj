/**
 * AppConfigController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  _config: { actions: true, rest: false, shortcuts: false },

  get: function (req, res) {
    AppConfig.findOne({
      appName: req.params.appName
    }, function (err, found) {
      if (!err) {
        if (found) {
          res.send(found.config);
        } else {
          res.notFound();
        }
      } else {
        res.serverError();
      }
    });
  },

  // TODO: add policy enables this action only for logged users
  update: function (req, res) {
    AppConfig.update({
      appName: req.params.appName
    }, {
      config: req.body
    }, function (err, updatedArr) {
      if (err) {
        res.serverError();
      } else if (updatedArr.length === 0) {
        res.notFound(); // TODO: implement adding new apps
      } else {
        res.ok();
      }
    });
  }
};

