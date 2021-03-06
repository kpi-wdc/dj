/**
 * AppConfigController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs');

module.exports = {
  getList: function (req, res) {
    AppConfig
      .find()
      .sort('name')
      .populate('owner')
      .then(function (apps) {
        res.ok(apps.map(function (app) {
          return {
            id: app.id,
            name: app.name,
            owner: app.owner && {
              id: app.owner.id,
              name: app.owner.name,
              email: app.owner.email
            }
          };
        })
      );
      }).catch(function () {
        res.serverError();
      });
  },

  create: function (req, res) {
    // Clone default application
    AppConfig.findOneByName('default')
      .then(function (newApp) {
        delete newApp.id;
        newApp.isPublished = true;
        newApp.name = req.params.appName;
        newApp.owner = req.user.id;
        AppConfig.destringifyPages(newApp);

        AppConfig.create(newApp).then(function (created) {
          res.ok({
            id: created.id
          });
        }).catch(function (err) {
          sails.log.error('Error while creating app: ' + err);
          res.serverError();
        });
      })
      .catch(function (error) {
        sails.log.warn('Error in AppController.create: ' + error);
        res.serverError();
      });
  },

  update: function (req, res) {
    AppConfig.update({
      id: req.params.appId
    }, req.body).then(function (updatedArr) {
      if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    }).catch(function (err) {
      sails.log.warn('AppController.update error: ' + err);
      res.serverError();
    });
  },

  export: function (req, res) {
    AppConfig.findOneById(req.params.appId)
      .populate('owner')
      .then(function (app) {
        if (!app) throw 'Cannot find app with specified id';
        var isOwner = AppConfig.isOwner(app, req.user);
        var isCollaborator = AppConfig.isCollaborator(app, req.user);
        if (isOwner || isCollaborator || app.isPublished) {
          res.setHeader('Content-disposition', 'attachment; filename=' + app.name + '.json');
          AppConfig.destringifyPages(app);
          delete app.id; // New id will be re-assigned when the app is exported
          delete app.owner; // The owner will change if another person exports this app
          delete app.collaborations; // We can't re-use this field because collaborator IDs aren't same in other DBs
          delete app.createdAt;
          delete app.updatedAt;
          res.send(app);
        } else {
          sails.log.silly('App is not published or user is not an owner');
          res.forbidden();
        }
      }).catch(function (err) {
        sails.log.silly(err);
        res.notFound();
      });
  },

  import: function (req, res) {
    req.file('file').upload({},
      function (err, uploadedFiles) {
        if (err) {
          return res.negotiate(err);
        }

        // if no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var file = uploadedFiles[0];
        fs.readFile(file.fd, function (err, body) {
          if (err) {
            return res.negotiate(err);
          }

          try {
            var app = JSON.parse(body);
            app.owner = req.user.id;
            app.skinName = app.skinName || 'default';
            AppConfig.create(app).then(function (created) {
              res.ok({
                name: app.name,
                id: created.id
              });
            }).catch(function (err) {
              sails.log.warn('AppController.export error: ' + err);
              res.serverError();
            });
          } catch (e) {
            res.send(415, e.message);
          }
        });
      });
  },


  rename: function (req, res) {
    AppConfig.update({
      id: req.params.appId
    }, {
      name: req.params.newAppName
    }).then(function (updatedArr) {
      if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    }).catch(function (err) {
      sails.log.error('Error while renaming app: ' + err);
      res.serverError();
    });
  },

  destroy: function (req, res) {
    AppConfig.destroy({
      id: req.params.appId
    }).then(function (updatedArr) {
      if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    }).catch(function (err) {
      sails.log.error('Error while deleting app: ' + err);
      res.serverError();
    });
  }
};

