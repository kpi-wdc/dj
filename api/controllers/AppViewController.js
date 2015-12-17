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

        AppConfig.destringifyConfigs(app);

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
          },
          publicAppConfig: {
            id: app.id,
            name: app.name,
            skinName: app.skinName,
            appWidgets: app.appWidgets || [],
            collaborations: app.collaborations || [],
            pages: app.pages || [],
            icon: app.icon,
            i18n: app.i18n,
            title: app.title,
            description: app.description,
            keywords: app.keywords,
            importedFromURL: app.importedFromURL,
            importedFromAuthor: app.importedFromAuthor,
            isPublished: app.isPublished
          }
        });
      }).catch(function (err) {
        sails.log.silly(err);
        res.notFound();
      });
  }
};

