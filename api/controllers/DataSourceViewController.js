/**
 * DataSourceViewController
 *
 * @description :: Server-side logic for managing data sources views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `DataSourceViewController.getView()`
   */
  getView: function (req, res) {
    res.view('data-sources');
  }
};

