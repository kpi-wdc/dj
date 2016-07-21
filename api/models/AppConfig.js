/**
* AppConfig.js
*
* @description :: Application configurations model
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true,
      notEmpty: true
    },
    skinName: {
      type: 'string',
      required: 'true',
      notEmpty: 'true'
    },
    appWidgets: {
      type: 'array'
    },
    pages: {
      type: 'array',
      required: true
    },
    icon: {
      type: 'string'
    },
    i18n: {
      type: 'json'
    },
    title: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string'
    },
    keywords: {
      type: 'array'
    },
    dps: {
      type: 'string'
    },
    collaborations: {
      type: 'array'
    },
    importedFromURL: {
      type: 'string'
    },
    importedFromAuthor: {
      type: 'string'
    },
    isPublished: {
      type: 'boolean',
      required: true
    },
    owner: {
      model: 'User'
    }
  },

  beforeValidate: function (app, cb) {
    // this is needed because app.pages[i] and app.appWidgets
    // are JSONs which might contain dots inside it's keys
    // it's not supported by mongodb: see http://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name
    // so we are stringifying it here and a reverse operation when passing data back to the user.
    if (app.pages) {
      for (var i = 0; i < app.pages.length; ++i) {
        app.pages[i] = JSON.stringify(app.pages[i]);
      }
    }

    if (app.appWidgets) {
      for (var i = 0; i < app.appWidgets.length; ++i) {
        app.appWidgets[i] = JSON.stringify(app.appWidgets[i]);
      }
    }

    cb();
  },

  destringifyConfigs: function (app) {
    if (app.appWidgets) {
      for (var i = 0; i < app.appWidgets.length; ++i) {
        app.appWidgets[i] = JSON.parse(app.appWidgets[i]);
      }
    }

    if (app.pages) {
      for (var i = 0; i < app.pages.length; ++i) {
        app.pages[i] = JSON.parse(app.pages[i]);
      }
    }
  },

  isCollaborator: function (app, user) {
    if (!user || !app.collaborations) {
      // user is not logged in - therefore not a collaborator
      return false;
    }
    return !_.isUndefined(_.find(app.collaborations,
      function (c) { return c.user.id === user.id; }
    ));
  },

  isOwner: function (app, user) {
    return (user && user.isAdmin) ||
      (app.owner && user && app.owner.id === user.id);
  }
};

