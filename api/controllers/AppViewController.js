/**
 * AppViewController
 *
 * @description :: Server-side logic for managing Appviews
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getView: function (req, res) {
    AppConfig.findOne({
      appName: req.params.appName
    }, function (err, found) {
      if (!err) {
        if (found) {
          res.view('app', found);
        } else {
          res.view('404', {error: "app not found"});
        }
      } else {
        res.serverError();
      }
    });
  }
};

