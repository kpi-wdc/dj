/**
 * isAppOwner
 *
 * @module      :: Policy
 * @description :: Simple policy to allow only application owners
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function (req, res, next) {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  sails.log.info('authorizing for app config update');
  if (req.user) {
    if (req.user.isAdmin) {
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
        if (AppConfig.isOwner(app, req.user)) {
          return next();
        }
        return res.forbidden();
      }).catch(function (err) {
        sails.log.info('isAppOwner policy: ' + err);
        res.forbidden();
      });
  } else {
    return res.forbidden('You are not logged in');
  }
};
