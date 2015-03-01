/**
 * AppViewController
 *
 * @description :: Server-side logic for managing Appviews
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getView: function (req, res) {
    AppConfig.findOne({ appName: req.params.appName})
      .populate('owner')
      .then(function (app) {
        res.view('app', {
          app: app,
          isAppOwner: !app.owner || (req.user && req.user.id === req.app.owner.id)
        });
      }).catch(function (err) {
        sails.log.silly(err);
        res.notFound();
      });
  }
};

