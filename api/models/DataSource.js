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
    name: {
      type: 'string',
      required: false
    },
    metadata: {
      type: 'json',
      required: true
    },
    value: {
      type: 'json',
      required: true
    },
    hash: {
      type: 'string',
      required: true,
      unique: true
    }
  }
};

