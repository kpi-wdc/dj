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
          ownerInfo: !app.owner ? {} : {
            name: app.owner.name,
            email: app.owner.email
          },
          isAppOwner: req.user && (!app.owner || req.user.id === app.owner.id)
        });
      }).catch(function (err) {
        sails.log.silly(err);
        res.notFound();
      });
  }
};

