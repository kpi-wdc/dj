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
            description:app.description,
            title:app.title,
            dps: app.dps,
            keywords: app.keywords,
            collaborations: app.collaborations,
            i18n: app.i18n,
            icon:app.icon,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            owner: app.owner && {
              id: app.owner.id,
              name: app.owner.name,
              email: app.owner.email,
              photo: app.owner.photo
            },
            importedFromURL: app.importedFromURL,
            importedFromAuthor: app.importedFromAuthor
          };
        })
      );
      }).catch(function () {
        res.serverError();
      });
  },
  // 
  // getList: function (req, res) {
  //   AppConfig
  //     .find()
  //     .sort('name')
  //     .populate('owner')
  //     .then(function (apps) {
  //       res.ok(apps)
  //     })
  //     .catch(function () {
  //       res.serverError();
  //     });
  // },

  createWithConfig: function (req, res) {
    // Clone default application
    if (!req.param('config')) {
      sails.log.error('App config not specified for new app in AppController.createWithConfig');
      res.badRequest();
    }
    var newApp = _.cloneDeep(req.param('config'));
    newApp.owner = req.user.id;

    AppConfig.create(newApp).then(function (created) {
      res.ok({
        id: created.id
      });
    }).catch(function (err) {
      sails.log.error('Error while creating app: ' + err);
      res.serverError();
    });
  },

  createCloneDefault: function (req, res) {
    // Clone default application
    var newApp = _.cloneDeep(sails.config.defaultAppConfigBase);
    delete newApp.id;
    newApp.isPublished = true;
    newApp.name = req.params.appName;
    newApp.owner = req.user.id;
    newApp.icon = "/img/default/"+Math.round(20*Math.random())+".png";

    if (req.param('skinName')) {
      newApp.skinName = req.param('skinName');
    }

    AppConfig.create(newApp).then(function (created) {
      res.ok({
        id: created.id
      });
    }).catch(function (err) {
      sails.log.error('Error while creating app: ' + err);
      res.serverError();
    });
  },

  getDefaultConfig: function (req, res) {
    res.ok(sails.config.defaultAppConfigBase);
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
        res.setHeader('Content-disposition', 'attachment; filename=' + app.name + '.json');
        AppConfig.destringifyConfigs(app);

        app.importedFromURL = sails.getBaseurl() + '/app/' + app.name;
        app.importedFromAuthor = app.owner && app.owner.name;

        delete app.id; // New id will be re-assigned when the app is exported
        delete app.owner; // The owner will change if another person exports this app
        delete app.collaborations; // We can't re-use this field because collaborator IDs aren't same in other DBs
        delete app.createdAt;
        delete app.updatedAt;

        res.send(app);
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
            app.name = req.file('file')._files[0].stream.filename;
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

