/**
 * AppListViewController
 *
 * @description :: Server-side logic for managing AppListPages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  _config: { actions: true, rest: false, shortcuts: false },
  /**
   * `AppListViewController.getView()`
   */
  getView: function (req, res) {
    AppConfig
      .find({sort: 'appName'})
      .populate('owner')
      .then(function (apps) {
        res.view('app-list', {
          apps: apps.map(function (app) {
            return {
              id: app.id,
              appName: app.appName,
              owner: app.owner && {
                name: app.owner.name,
                email: app.owner.email
              }
            };
          })
        });
      }).catch(function () {
        res.serverError();
      });
  }
};

