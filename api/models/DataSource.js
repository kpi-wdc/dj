/**
 * DataSource.js
 *
 * @description :: Data Source model
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
    hash: {
      type: 'string',
      unique: true,
      required: true
    }
  }
};

