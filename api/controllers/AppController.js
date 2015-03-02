/**
 * AppConfigController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  _config: { actions: true, rest: false, shortcuts: false },

  getConfig: function (req, res) {
    AppConfig.findOne({
      appName: req.params.appName
    }, function (err, found) {
      if (!err) {
        if (found) {
          res.send(found.config);
        } else {
          res.forbidden();
        }
      } else {
        res.serverError();
      }
    });
  },

  create: function (req, res) {
    AppConfig.create({
      appName: req.params.appName,
      config: { "pages" : []},
      owner: req.user.id
    }, function (err) {
      if (err) {
        sails.log.error('Error while creating app: ' + err);
        res.serverError();
      } else {
        res.ok();
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
        res.forbidden();
      } else {
        res.ok();
      }
    });
  },

  rename: function (req, res) {
    AppConfig.update({
      appName: req.params.appName
    }, {
      appName: req.params.newAppName
    }, function (err, updatedArr) {
      if (err) {
        sails.log.error('Error while renaming app: ' + err);
        res.serverError();
      } else if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    });
  },

  delete: function (req, res) {
    AppConfig.destroy({
      appName: req.params.appName
    }, function (err, updatedArr) {
      if (err) {
        sails.log.error('Error while renaming app: ' + err);
        res.serverError();
      } else if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    });
  }
};

