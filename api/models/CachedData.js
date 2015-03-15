/**
 * CachedData.js
 *
 * @description :: Server-side cache for client's computations requests
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    body: {
      type: 'json',
      required: true
    },
    cachedDataId: {       // == md5hash of input data sent to server
      type: 'string',
      unique: true,
      required: true
    }
  }
};

