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
      type: 'alphanumericdashed',
      required: true,
      unique: true,
      notEmpty: true
    },
    pages: {
      type: 'array',
      required: true
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
    collaborations: {
      type: 'array'
    },
    isPublished: {
      type: 'boolean',
      required: true
    },
    owner: {
      model: 'User'
    }
  },

  afterValidate: function (app, cb) {
    // this is needed because app.pages[i] is a JSON which might contain dots inside it's keys
    // it's not supported by mongodb: see http://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name
    // so we are stringifying it here and a reverse operation when passing data back to the user.
    if (!app.pages) {
      cb();
      return;
    }
    for (var i = 0; i < app.pages.length; ++i) {
      app.pages[i] = JSON.stringify(app.pages[i]);
    }
    cb();
  },

  destringifyPages: function (app) {
    if (!app.pages) return;
    for (var i = 0; i < app.pages.length; ++i) {
      app.pages[i] = JSON.parse(app.pages[i]);
    }
  },

  isCollaborator: function (app, user) {
    if (!user) {
      // user is not logged in - therefore not a collaborator
      return false;
    }
    return !_.isUndefined(_.find(app.collaborations,
      function (c) { return c.user.id === user.id; }
    ));
  },

  isOwner: function (app, user) {
    if (!app.owner) {
      // No owner means every logged user is an owner
      return true;
    }
    if (!user) {
      // user is not logged in - therefore not an owner
      return false;
    }
    return app.owner.id === user.id;
  }
};

