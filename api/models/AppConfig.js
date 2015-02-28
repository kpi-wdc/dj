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
    appName: {
      type: 'string',
      required: true,
      unique: true,
      notEmpty: true
    },
    config: {
      type: 'json',
      required: true
    }
  }
};

