/**
 * AppConfigController
 *
 * @description :: Server-side logic for managing app configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  _config: { actions: true, rest: false, shortcuts: false },

  create: function (req, res) {
    AppConfig.create({
      name: req.params.appName,
      pages: [ { "shortTitle" : "Home", "href": "", "template" : "1-col", "holders" : { "column": { "widgets": [ { "type": "title", "title": "Home page", "instanceName": "title-widget"}, { "type": "htmlwidget", "instanceName": "main-page-html-widget", "text": "<h3>Page Title <small>Page subtitle</small></h3>Bacon ipsum dolor sit amet salami ham."}]}}}, { "href": "404", "template" : "1-col", "holders" : { "column": { "widgets": [ { "type": "title", "title": "404 error", "instanceName": "title"}, { "type": "htmlwidget", "text": "Page not found", "instanceName": "error-message"}]}}}],
      title: "Title",
      description: "Description",
      isPublished: true,
      owner: req.user.id
    }, function (err) {
      if (err) {
        sails.log.error('Error while creating app: ' + err);
        res.serverError();
      } else {
        res.ok();
      }
    });
  },

  update: function (req, res) {
    AppConfig.update({
      id: req.params.appId
    }, {
      pages: req.body.pages
    }, function (err, updatedArr) {
      if (err) {
        res.serverError();
      } else if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    });
  },

  rename: function (req, res) {
    AppConfig.update({
      id: req.params.appId
    }, {
      name: req.params.newAppName
    }, function (err, updatedArr) {
      if (err) {
        sails.log.error('Error while renaming app: ' + err);
        res.serverError();
      } else if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    });
  },

  delete: function (req, res) {
    AppConfig.destroy({
      id: req.params.appId
    }, function (err, updatedArr) {
      if (err) {
        sails.log.error('Error while renaming app: ' + err);
        res.serverError();
      } else if (updatedArr.length === 0) {
        res.forbidden();
      } else {
        res.ok();
      }
    });
  }
};

