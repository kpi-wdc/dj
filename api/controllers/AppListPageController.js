/**
 * AppListPageController
 *
 * @description :: Server-side logic for managing AppListPages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  _config: { actions: true, rest: false, shortcuts: false },
  /**
   * `AppListPageController.getView()`
   */
  getView: function (req, res) {
    AppConfig.find().then(function (apps) {
      res.view('appList', {
        apps: apps
      });
    }).catch(function () {
      res.serverError();
    });
  },

  /**
   * `AppListPageController.createApp()`
   */
  createApp: function (req, res) {
    AppConfig.create({
      appName: req.body.appName,
      config: { "pages" : []}
    }, function (err) {
      if (err) {
        sails.log.error('Error while creating app: ' + err);
        res.serverError();
      } else {
        res.redirect('/app/' + req.body.appName);
      }
    });
  }
};

