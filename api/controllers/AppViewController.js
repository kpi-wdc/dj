/**
 * AppViewController
 *
 * @description :: Server-side logic for managing Appviews
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getView: function (req, res) {
    // fixme: do case-insensitive search here!
    AppConfig.findOne({ name: req.params.appName})
      .populate('owner')
      .then(function (app) {
        var isAppOwner = req.user && (!app.owner || req.user.id === app.owner.id);

        if (isAppOwner || app.isPublished) {
          res.view('app', {
            app: app,
            ownerInfo: !app.owner ? {} : {
              name: app.owner.name,
              email: app.owner.email
            },
            isAppOwner: isAppOwner
          });
        } else {
          sails.log.silly('App is not published or user is not an owner');
          res.forbidden();
        }
      }).catch(function (err) {
        sails.log.silly(err);
        res.notFound();
      });
  }
};

