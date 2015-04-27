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
          ProcData.findOne({hash : md5}).then(function (json) {
            // json, corresponding to md5 hash already exists in a database,
            // so there is no need to process xls again, just send back its id
            if (json) {
              return res.send(json.id);
            } else {
              var child = launcher.instance(sails.config.executables.xlsx2json, [uploadedFileAbsolutePath]);
              // listen to a message with processed json
              child.onMessage(function(json) {
                ProcData.create({
                  name: json.name,
                  metadata: json.metadata,
                  value: json.value,
                  hash: md5,
                  isDataSource: true
                }, function (err, obj) {
                  if (err) {
                    sails.log.error('Error while adding new data source: ' + err);
                    return res.serverError();
                  } else {
                    // send back newly created object's id
                    return res.send(obj.id);
                  }
                });
              });

              child.onStdErr(function(err) {
                sails.log.error('Error while adding new data source: ' + err);
                return res.serverError();
              });

              // listen on process termination to get termination code (0 indicated success)
              child.onTerminate(function(code) {
                if (code != 0) {
                  sails.log.error('Error while adding new data source, return code ' + code);
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
    ProcData.findOne({
      id: req.params.dataSourceId,
      isDataSource : true
    }, function (err, found) {
      if (!err) {
        if (found) {
          delete found.hash;
          delete found.isDataSource;
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
   *  Lists all available data sources without value field
   */
  list: function (req, res) {
    ProcData.find({isDataSource : true},
      function (err, found) {
      if (!err) {
        if (found) {
          for (var i = 0; i < found.length; i++) {
            delete found[i].hash;
            delete found[i].value;
            delete found[i].isDataSource;
          }
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

