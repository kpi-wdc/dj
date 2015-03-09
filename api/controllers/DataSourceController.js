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

        var exec = require('child_process').exec;
        var child = exec('node ./proc/xlsx2json/run.js ' + uploadedFiles[0].fd);
        child.stdout.on('data', function(data) {
          var jsonAndHash = data.split("|");
          DataSource.create({
            body: jsonAndHash[0],
            hash: jsonAndHash[1]
          }, function (err) {
            if (err) {
              sails.log.error('Error while adding new data source: ' + err);
              res.serverError();
            } else {
              res.ok();
            }
          });
        });
        child.stderr.on('data', function(err) {
          sails.log.error('Error while adding new data source: ' + err);
          res.serverError();
        });
        child.on('close', function(code) {
          if (code != 0) {
            sails.log.error('Error while adding new data source: ' + err);
            res.serverError();
          }
        });
    });
  },


  /**
   * `DataSourceController.getById()`
   *  Gets a data source by its id
   */
  getById: function (req, res) {
    DataSource.findOne({
      id: req.params.dataSourceId
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

