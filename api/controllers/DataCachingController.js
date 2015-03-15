/**
 * DataCachingController
 *
 * @description :: Server-side logic for managing Datacachings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `DataCachingController.cache()`
   */
  cache: function (req, res) {
    if (!req.body.conf) return res.badRequest('No configuration was provided');
    var md5 = datacrypto.getObjectMd5(req.body.conf);
    CachedData.findOne({cachedDataId : md5}).then(function (json) {
      // json, corresponding to md5 hash already exists in a database,
      // so there is no need to perform computations again, just return previous
      // result
      if (json) {
        return res.json(json.body);
      } else {
        // TODO: process req.body.conf and get a result
/*        console.log(md5 + " new");
        // TODO: process req.body.conf and get a result
        var result = {TODO: "Implement"};

        // Insert computed result into a database
        CachedData.create({
          body: result,
          cachedDataId: md5
        }, function (err) {
          if (err) {
            sails.log.error('Error while adding processed configuration: ' + err);
            return res.serverError();
          } else {
            return res.json({
              processed: result
            });
          }
        });*/

        return res.json({
          cachedDataId: md5
        });
      }
    });
  },

  /**
   * `DataCachingController.save()`
   *  Persists processed configuration in a database
   */
  save: function (req, res) {
    console.log("save");
    CachedData.create({
      body: req.body.processed,
      cachedDataId: req.params.cachedDataId
    }, function (err) {
      if (err) {
        sails.log.error('Error while adding processed configuration: ' + err);
        return res.serverError();
      } else {
        return res.ok();
      }
    });
  }
};

