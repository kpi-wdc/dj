/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  // Login URLs
  'get /logout': 'AuthController.logout',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  // Main urls
  'get /': 'AppListViewController.getView',
  'get /api/app/create/:appName': 'AppController.create',
  'get /app/:appName': 'AppViewController.getView',
  'get /app/:appName/*': 'AppViewController.getView',
  'get /api/app/config/:appName': 'AppController.getConfig',
  'put /api/app/config/:appName': 'AppController.update',
  'get /api/app/rename/:appName/:newAppName': 'AppController.rename',
  'get /api/app/delete/:appName': 'AppController.delete',

  // DataSource manipulation URLs
  'post /api/data/dataSource' : 'DataSourceController.add',
  'get /api/data/dataSource/:dataSourceId' : 'DataSourceController.getByDataSourceId',
  'get /api/data/dataSources/' : 'DataSourceController.list',

  // DataSource view URLs
  'get /data/dataSources': 'DataSourceViewController.getView'
};
