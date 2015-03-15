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
          id: app.id,
          appName: app.appName,
          pages: app.pages,
          description: app.description,
          ownerInfo: !app.owner ? {} : {
            name: app.owner.name,
            email: app.owner.email
          },
          isPublished: app.isPublished,
          isAppOwner: req.user && (!app.owner || req.user.id === app.owner.id)
        });
      }).catch(function (err) {
        sails.log.silly(err);
        res.notFound();
      });
  }
};

