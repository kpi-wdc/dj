/**
 * UserController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See hhttp://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: { actions: true, rest: false, shortcuts: false },

  getList: function (req, res) {
    User.find().then(function (result) {
      // todo: add support for filtering users
      res.ok(result);
    }, function (err) {
      sails.log.error('Error while getting list of users' + err);
      res.serverError();
    })
  }
};

