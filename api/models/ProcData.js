/**
 * ProcData.js
 *
 * @description :: Model for all processed data (either data source
 *                  data or some other saved/processed)
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: false
    },
    isDataSource: {
      type: 'boolean',
      required: false
    },
    metadata: {
      type: 'json',
      required: false
    },
    value: {
      type: 'json',
      required: true
    },
    parent: {
      type: 'string',
      required: false
    },
    hash: {
      type: 'string',
      required: false,
      unique: true
    }
  }
};

