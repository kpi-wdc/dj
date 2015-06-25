/**
 * AppViewController
 *
 * @description :: Server-side logic for managing Appviews
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getView: function (req, res) {
    // fixme: do case-insensitive search here!
    AppConfig.findOneByName(req.params.appName || 'app-list')
      .populate('owner')
      .then(function (app) {
        var isOwner = AppConfig.isOwner(app, req.user);
        var isCollaborator = AppConfig.isCollaborator(app, req.user);

        AppConfig.destringifyPages(app);

        var userInfo;
        if (req.user) {
          userInfo = _.extend(_.clone(req.user), {
            isLoggedIn: true,
            isOwner: isOwner,
            isCollaborator: isCollaborator
          });
        } else {
          userInfo = {
            isLoggedIn: false,
            isOwner: isOwner,
            isCollaborator: isCollaborator
          };
        }

        res.view('app', {
          app: app,
          userInfo: userInfo,
          ownerInfo: !app.owner ? {
            exists: false
          } : {
            id: app.owner.id,
            name: app.owner.name,
            email: app.owner.email,
            photo: app.owner.photo,
            exists: true
          }
        });
      }).catch(function (err) {
        sails.log.silly(err);
        res.notFound();
      });
  }
};

