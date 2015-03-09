/**
 * DataSourceViewController
 *
 * @description :: Server-side logic for managing data sources views
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `DataSourceViewController.getView()`
   */
  getView: function (req, res) {
    res.view('data-sources');
  }
};

