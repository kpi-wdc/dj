/**
 * isOwnerOrCollaborator
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
    var query;
    if (req.params.appId) {
      query = {id: req.params.appId};
    } else if(req.params.appName) {
      query = {name: req.params.appName};
    } else {
      return res.forbidden('No appId or appName were passed!');
    }
    AppConfig.findOne(query)
      .populate('owner')
      .then(function (found) {
        if (!found) {
          // App not found - let controller handle this
          return next();
        }
        if (!found.owner) {
          // Allow modifying apps without owner
          return next();
        }
        if (found.owner.id === req.user.id) {
          // User is the owner therefore is permitted
          return next();
        }
        if (AppConfig.isCollaborator(found, req.user)) {
          return next();
        }
        return res.forbidden();
      }).catch(function (err) {
        sails.log.info('isOwnerOrCollaborator policy: ' + err);
        res.forbidden();
      });
  } else {
    return res.forbidden('You are not logged in');
  }
};
