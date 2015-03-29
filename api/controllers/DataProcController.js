/**
 * DataProcController
 *
 * @description :: Server-side logic for managing data processes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /**
   * `DataProcController.process()`
   */
  process: function (req, res) {
    var launchingFilePath = sails.config.executables[req.body.proc_name];
    var child = require('child_process').fork(launchingFilePath, [], {silent: true});

    var obj_to_process = {};
    var parent_proc = "";
    if (req.body.data) {
      console.log("data");
      obj_to_process.data = req.body.data;
      obj_to_process.params = req.body.params;
      console.log(obj_to_process.data.values);
      child.send(obj_to_process);
    } else if (req.body.data_id) {
      console.log("data_id");
      ProcData.findOne({
        id: req.body.data_id
      }, function (err, found) {
        if (!err) {
          if (found) {
            obj_to_process.data = found.value;
            obj_to_process.params = req.body.params;
            parent_proc = found.id;
            child.send(obj_to_process);
          } else {
            return res.forbidden("No data was found for the specified id");
          }
        } else {
          return res.serverError();
        }
      })
    } else {
      return res.badRequest("Request must contain either data or data_id field");
    }

    var res_body = {};
    var err_body = {};
    child.on('message', function(msg) {
      console.log(msg);
      res_body.data = msg;
    });

    child.stderr.on('data', function(err) {
      err_body.err = err.toString();
      console.log(err_body.err);
    });

    child.on('close', function(code) {
      if (code == 0) {
        res_body.status_code = code;
        // save result to DB
        ProcData.create({
          value: res_body.data,
          parent: parent_proc
        }, function (err, obj) {
          if (err) {
            sails.log.error('Error while processing proc request: ' + err);
            return res.serverError();
          } else {
            res_body.data_id = obj.id;
            if (parent_proc) {
              res_body.parent = parent_proc;
            }
            if (req.body.response_type === "data_id") {
              delete res_body.data;
            }
            return res.json(res_body);
          }
        });
      } else {
        err_body.status_code = code;
        return res.badRequest(err_body);
      }
    });
  }
};

