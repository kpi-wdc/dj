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
        res.view('app', {
          id: app.id,
          name: app.name,
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

