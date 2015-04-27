/**
 * UserController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
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

