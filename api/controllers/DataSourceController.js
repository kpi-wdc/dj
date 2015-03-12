/**
 * DataSourceController
 *
 * @description :: Server-side logic for managing Datasources
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /**
   * `DataSourceController.add()`
   *  Adds a new data source from xlsx file
   */

  add: function (req, res) {
    req.file('file').upload({},
      function whenDone(err, uploadedFiles) {
        if (err) {
          return res.negotiate(err);
        }

        // if no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var uploadedFileAbsolutePath = uploadedFiles[0].fd;
        filecrypto.getMd5(uploadedFileAbsolutePath, function(md5) {
          DataSource.findOne({hash : md5}).then(function (json) {
            // json, corresponding to md5 hash already exists in a database,
            // so there is no need to process xls again
            if (json) {
              return res.badRequest('This xls configuration has already been processed');
            } else {
              var exec = require('child_process').exec;
              var child = exec('node ./proc/xlsx2json/run.js ' + uploadedFileAbsolutePath);
              child.stdout.on('data', function(json) {
                DataSource.create({
                  body: json,
                  dataSourceId: md5
                }, function (err) {
                  if (err) {
                    sails.log.error('Error while adding new data source: ' + err);
                    return res.serverError();
                  } else {
                    return res.ok();
                  }
                });
              });
              child.stderr.on('data', function(err) {
                sails.log.error('Error while adding new data source: ' + err);
                return res.serverError();
              });
              child.on('close', function(code) {
                if (code != 0) {
                  sails.log.error('Error while adding new data source: ' + err);
                  return res.serverError();
                }
              });
            }
          });
        });
    });
  },


  /**
   * `DataSourceController.getById()`
   *  Gets a data source by its id
   */
  getByDataSourceId: function (req, res) {
    DataSource.findOne({
      dataSourceId: req.params.dataSourceId
    }, function (err, found) {
      if (!err) {
        if (found) {
          res.send(found);
        } else {
          res.forbidden();
        }
      } else {
        res.serverError();
      }
    });
  },


  /**
   * `DataSourceController.list()`
   *  Lists all available data sources
   */
  list: function (req, res) {
    DataSource.find({},
      function (err, found) {
      if (!err) {
        if (found) {
          res.send(found);
        } else {
          res.forbidden();
        }
      } else {
        res.serverError();
      }
    });
  }
};

