/**
 * AppConfigController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  _config: { actions: true, rest: false, shortcuts: false },

  create: function (req, res) {
    // Clone default application
    AppConfig.findOne({name: 'default'})
      .then(function (newApp) {
        delete newApp.id;
        newApp.isPublished = true;
        newApp.name = req.params.appName
        newApp.owner = req.user.id;

        AppConfig.create(newApp, function (err) {
          if (err) {
            sails.log.error('Error while creating app: ' + err);
            res.serverError();
          } else {
            res.ok();
          }
        });
      })
      .catch(function (error) {
        sails.log.warn('Error in AppController.create: ' + error);
        res.serverError();
      });
  },

  update: function (req, res) {
    AppConfig.update({
      id: req.params.appId
    }, {
      pages: req.body.pages
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
      id: req.params.appId
    }, {
      name: req.params.newAppName
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
      id: req.params.appId
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

