/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var path = require('path');
var express = require('express');
var staticPath = path.join('.tmp', 'public');

module.exports = {

  hookTimeout: 40000,

  blueprints: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Setup proxy settings (for e.g. heroku server) for OAuth callbacks       *
   ***************************************************************************/
  proxyHost: process.env.APP_HOST,
  proxyPort: 80,

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: process.env.PORT || 80,

  http: {
    middleware: {
      www: express.static(staticPath, {
        maxAge: 20 * 60 * 1000 // 20 min and only in production
      })
    }
  },

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

   log: {
     level: process.env.SAILS_LOG_LEVEL || "warn"
   }

};
