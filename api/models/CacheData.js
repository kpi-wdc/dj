/**
 * CacheData.js
 *
 * @description :: Model for cached data
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    tag: {
      type: 'string',
      required: false
    },
    value: {
      type: 'json',
      required: true
    },
    params: {
      type: 'json',
      required: false
    },
    hash: {
      type: 'string',
      required: false,
      unique: true
    }
  }
};

