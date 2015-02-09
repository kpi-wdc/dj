/**
* AppConfig.js
*
* @description :: Application configurations model
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    appName: {
      type: 'string',
      required: true,
      unique: true
    },
    config: {
      type: 'json',
      required: true
    }
  }
};

