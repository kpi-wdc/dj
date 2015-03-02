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
  if (req.user) {
    sails.log.info('authenticated for app config update');
    AppConfig.findOne({appName: req.params.appName})
      .populate('owner')
      .then(function (found) {
        // Allow modifying apps owned by this user AND apps without owner
        if (!found.owner || found.owner.id === req.user.id) {
          next();
        } else {
          res.forbidden();
        }
      }).catch(function (err) {
        sails.log.info('isAppOwner policy: ' + err);
        res.forbidden();
      });
  } else {
    return res.forbidden('You are not logged in');
  }
};
