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
  }
};

