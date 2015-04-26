/**
 * AppConfigController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
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

        AppConfig.create(newApp).then(function (created) {
          res.ok({
            id: created.id
          });
        }).catch(function (err) {
          sails.log.error('Error while creating app: ' + err);
          res.serverError();
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
    }, req.body).then(function (updatedArr) {
      if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    }).catch(function (err) {
      sails.log.warn('AppController.update error: ' + err);
      res.serverError();
    });
  },

  rename: function (req, res) {
    AppConfig.update({
      id: req.params.appId
    }, {
      name: req.params.newAppName
    }).then(function (updatedArr) {
      if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    }).catch(function (err) {
      sails.log.error('Error while renaming app: ' + err);
      res.serverError();
    });
  },

  delete: function (req, res) {
    AppConfig.destroy({
      id: req.params.appId
    }).then(function (updatedArr) {
      if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    }).catch(function (err) {
      sails.log.error('Error while deleting app: ' + err);
      res.serverError();
    });
  }
};

