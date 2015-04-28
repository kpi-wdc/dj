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
        var isOwner = AppConfig.isOwner(app, req.user);
        var isCollaborator = AppConfig.isCollaborator(app, req.user);
        if (isOwner || isCollaborator || app.isPublished) {
          AppConfig.destringifyPages(app);
          res.view('app', {
            app: app,
            ownerInfo: !app.owner ? {
              exists: false
            } : {
              id: app.owner.id,
              name: app.owner.name,
              email: app.owner.email,
              photo: app.owner.photo,
              exists: true
            },
            isOwner: isOwner,
            isCollaborator: isCollaborator
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

