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
  'post /api/data/process' : 'DataProcController.process1',
  'get /api/data/process/:dataId' : 'DataProcController.getById1',

  'get /api/data/process/update/:id' : 'DataProcController.updateProcData',
  


// Dataset Dictionary API
  'post /api/dictionary' : 'DictionaryController.getAllDictionaries',
  'get /api/dictionary' : 'DictionaryController.getAllDictionaries',
  'post /api/dictionary/update' : 'DictionaryController.uploadDictionary',
  'post /api/dictionary/download' : 'DictionaryController.downloadDictionary',
  'get /api/dictionary/download' : 'DictionaryController.downloadDictionary',
  
  
// 
// Dataset Managing API
// 
  'post /api/dataset/get/:datasetID' : 'DatasetController.getDataset',
  'get /api/dataset/get/:datasetID' : 'DatasetController.getDataset',

  'post /api/dataset/download/:datasetID' : 'DatasetController.downloadDataset',
  'get /api/dataset/download/:datasetID' : 'DatasetController.downloadDataset',

  'post /api/dataset/id/create' : 'DatasetController.getNewDatasetId',
  'get /api/dataset/id/create' : 'DatasetController.getNewDatasetId',

  'post /api/dataset/create' : 'DatasetController.createDataset',
  'get /api/dataset/create' : 'DatasetController.createDataset',

  'post /api/dataset/update' : 'DatasetController.updateDataset',

  'post /api/dataset/ch/update' : 'DatasetController.updateChDatasetGroup',

  
  'post /api/dataset/query' : 'DatasetController.getQueryResult',

//
// Cached Tables API 
//   
  
  'get /api/table/download/:tableID' : 'TableController.downloadTable',
  'get /api/table/delete/:tableID' : 'TableController.deleteTable',
  'get /api/table' : 'TableController.getAllTables',

// 
// Dataset Contorl Version Service API
// 

  'post /api/dataset/commits/:datasetID' : 'DatasetCVController.getCommitList',
  'get /api/dataset/commits/:datasetID' : 'DatasetCVController.getCommitList',

  'post /api/commit/head/:commitID' : 'DatasetCVController.setHead',
  'get /api/commit/head/:commitID' : 'DatasetCVController.setHead',

  'post /api/commit/download/:commitID' : 'DatasetCVController.downloadCommit',
  'get /api/commit/download/:commitID' : 'DatasetCVController.downloadCommit',

  'post /api/commit/delete/:commitID' : 'DatasetCVController.deleteCommit',
  'get /api/commit/delete/:commitID' : 'DatasetCVController.deleteCommit',

  'post /api/commit/public/:commitID' : 'DatasetCVController.setPublicStatus',
  'get /api/commit/public/:commitID' : 'DatasetCVController.setPublicStatus',

  'post /api/commit/private/:commitID' : 'DatasetCVController.setPrivateStatus',
  'get /api/commit/private/:commitID' : 'DatasetCVController.setPrivateStatus',

//
// Dataset Metadata API 
//  
 
  'post /api/metadata/get/:datasetID' : 'MetadataController.getMetadata',
  'get /api/metadata/get/:datasetID' : 'MetadataController.getMetadata',

  'get /api/metadata/items' : 'MetadataController.getMetadataList',
  'post /api/metadata/items' : 'MetadataController.getMetadataList',

  'get /api/metadata/tag/items' : 'MetadataController.getTagList',
  'post /api/metadata/tag/items' : 'MetadataController.getTagList',

  'get /api/metadata/tag/total' : 'MetadataController.getTagTotal',
  'post /api/metadata/tag/total' : 'MetadataController.getTagTotal',

  'get /api/metadata/tag/tree' : 'MetadataController.getTopicTree',
  'post /api/metadata/tag/tree' : 'MetadataController.getTopicTree',
  'post /api/metadata/tag/dependencies': 'MetadataController.getDependencies',

//
// 
//   

  // 'post /api/timeline/create': "DatasetController.createTimeline",
 
// 
// Timeline Service API
// 

  'post /api/timeline/upload' : 'TimelineController.upload',
  'post /api/timeline/get/:id' : 'TimelineController.get',
  'get /api/timeline/get/:id' : 'TimelineController.get',


// 
// Resource Service API
// 
  
  'get /api/resource' : 'ResourceController.getList',

  'post /api/resource/update' : 'ResourceController.update',
  'post /api/resource/rename' : 'ResourceController.rename',


  'get /api/resource/:path' : 'ResourceController.get',
  'post /api/resource/:path' : 'ResourceController.get',
  
  'get /api/resource/delete/:path' : 'ResourceController.delete',
  'post /api/resource/delete/:path' : 'ResourceController.delete',
   
 // Cache servce API
   'get /api/test/get/:id' : 'TestCacheController.getID',
   'post /api/test/get' : 'TestCacheController.getQuery',
   'post /api/test/set' : 'TestCacheController.save',
   'get /api/test/clear' : 'TestCacheController.clear',
   'get /api/test/list' : 'TestCacheController.list'
   

   
    
  
  


};
