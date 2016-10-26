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
  // Auth URLs
  'get /logout': 'AuthController.logout',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  // Views
  'get /': 'AppViewController.getView',
  'get /app/:appName': 'AppViewController.getView',
  'get /app/:appName/*': 'AppViewController.getView',

  //Help
  'get /help/widget/:widgetType/:lang': 'HelpController.getHelp',
  'get /help/widget/:widgetType/img/:imgName': 'HelpController.getImage',

  /*** APIs ***/
  // IMPORTANT! - don't forget to update policies.js!
  // 
  
  //Portal
   'get /api/app/config/get': 'PortalConfigController.getConfig',
   'get /api/app/skins': 'PortalConfigController.getSkins',
   'post /api/app/config/get': 'PortalConfigController.getConfig',
   'post /api/app/config/set': 'PortalConfigController.setConfig',
     
  

  // Apps
  'get /api/app/get-list': 'AppController.getList',
  'get /api/app/get-default-config': 'AppController.getDefaultConfig',
  'get /api/app/create/:appName': 'AppController.createCloneDefault',
  'post /api/app/create/': 'AppController.createWithConfig',
  'put /api/app/config/:appId': 'AppController.update',
  'get /api/app/export/:appId': 'AppController.export',
  'post /api/app/import': 'AppController.import',
  'get /api/app/rename/:appId/:newAppName': 'AppController.rename',
  'get /api/app/destroy/:appId': 'AppController.destroy',

  // Users
  'get /api/users/list': 'UserController.getList',
  'post /api/admin/set': 'UserController.setAdminGrant',

  // DataSource manipulation URLs
  'post /api/data/dataSource' : 'DataSourceController.add',
  'get /api/data/dataSource/:dataSourceId' : 'DataSourceController.getByDataSourceId',
  'get /api/data/dataSources/' : 'DataSourceController.list',

  // DataProcessing manipulation URLs
  'post /api/data/process' : 'DataProcController.process',
  'get /api/data/process/:dataId' : 'DataProcController.getById',

// Dictionary manipulation URLs
  'post /api/dictionary' : 'DictionaryController.getAllDictionaries',
  'get /api/dictionary' : 'DictionaryController.getAllDictionaries',
  'post /api/dictionary/update' : 'DictionaryController.uploadDictionary',
  'post /api/dictionary/download' : 'DictionaryController.downloadDictionary',
  'get /api/dictionary/download' : 'DictionaryController.downloadDictionary',
  
  

// Dataset manipulation URLs
// 
  'post /api/dataset/get/:datasetID' : 'DatasetController.getDataset',
  'get /api/dataset/get/:datasetID' : 'DatasetController.getDataset',

  'post /api/dataset/download/:datasetID' : 'DatasetController.downloadDataset',
  'get /api/dataset/download/:datasetID' : 'DatasetController.downloadDataset',

  'post /api/dataset/create' : 'DatasetController.createDataset',
  'get /api/dataset/create' : 'DatasetController.createDataset',

  'post /api/dataset/update' : 'DatasetController.updateDataset',

  'post /api/dataset/commits/:datasetID' : 'DatasetController.getCommitList',
  'get /api/dataset/commits/:datasetID' : 'DatasetController.getCommitList',

  'post /api/dataset/query' : 'DatasetController.getQueryResult',

  'get /api/table/download/:tableID' : 'DatasetController.downloadTable',
  'get /api/table/delete/:tableID' : 'DatasetController.deleteTable',
  'get /api/table' : 'DatasetController.getAllTables',
  
  
  'post /api/commit/head/:commitID' : 'DatasetController.setHead',
  'get /api/commit/head/:commitID' : 'DatasetController.setHead',

  'post /api/commit/download/:commitID' : 'DatasetController.downloadCommit',
  'get /api/commit/download/:commitID' : 'DatasetController.downloadCommit',

  'post /api/commit/delete/:commitID' : 'DatasetController.deleteCommit',
  'get /api/commit/delete/:commitID' : 'DatasetController.deleteCommit',

  'post /api/commit/public/:commitID' : 'DatasetController.setPublicStatus',
  'get /api/commit/public/:commitID' : 'DatasetController.setPublicStatus',

  'post /api/commit/private/:commitID' : 'DatasetController.setPrivateStatus',
  'get /api/commit/private/:commitID' : 'DatasetController.setPrivateStatus',
  
  'post /api/metadata/get/:datasetID' : 'DatasetController.getMetadata',
  'get /api/metadata/get/:datasetID' : 'DatasetController.getMetadata',

  'get /api/metadata/items' : 'DatasetController.getMetadataList',
  'post /api/metadata/items' : 'DatasetController.getMetadataList',

  'get /api/metadata/tag/items' : 'DatasetController.getTagList',
  'post /api/metadata/tag/items' : 'DatasetController.getTagList',

  'get /api/metadata/tag/total' : 'DatasetController.getTagTotal',
  'post /api/metadata/tag/total' : 'DatasetController.getTagTotal',

  'get /api/metadata/tag/tree' : 'DatasetController.getTopicTree',
  'post /api/metadata/tag/tree' : 'DatasetController.getTopicTree',
  'post /api/metadata/tag/dependencies': 'DatasetController.getDependencies',

  'post /api/timeline/create': "DatasetController.createTimeline",
  
  'get /api/resource' : 'ResourceController.getList',

  'post /api/resource/update' : 'ResourceController.update',
  'post /api/resource/rename' : 'ResourceController.rename',


  'get /api/resource/:path' : 'ResourceController.get',
  'post /api/resource/:path' : 'ResourceController.get',
  
  'get /api/resource/delete/:path' : 'ResourceController.delete',
  'post /api/resource/delete/:path' : 'ResourceController.delete',

   'get /api/test/get/:id' : 'TestCacheController.getID',
   'post /api/test/get' : 'TestCacheController.getQuery',
   'post /api/test/set' : 'TestCacheController.save',
   'get /api/test/clear' : 'TestCacheController.clear',
   'get /api/test/list' : 'TestCacheController.list'
   
   
   
    
  
  


};
