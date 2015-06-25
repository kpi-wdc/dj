/**
 * isOwnerOrCollaboratorOrAppPublished
 *
 * @module      :: Policy
 * @description :: Simple policy to allow only application owners, collaborators
 * or if app is published
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  var query;
  if (req.params.appId) {
    query = {id: req.params.appId};
  } else if(req.params.appName) {
    query = {name: req.params.appName};
  } else {
    return next();
  }
  AppConfig.findOne(query)
    .populate('owner')
    .then(function (app) {
      if (app.isPublished ||
        AppConfig.isOwner(app, req.user) ||
        AppConfig.isCollaborator(app, req.user)) {
        return next();
      } else {
        sails.log('isOwnerOrCollaboratorOrAppPublished policy not passed');
        return res.forbidden();
      }
    }).catch(function (err) {
      sails.log.info('isOwnerOrCollaboratorOrAppPublished policy: ' + err);
      res.forbidden();
    });
};
