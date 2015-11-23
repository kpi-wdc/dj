/**
 * Dictionary.js
 *
 * @description :: Model for dictionary of simple info objects
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    key: {
      type: 'string',
      required: true,
      unique: true
    },
    value: {
      type: 'string',
      label: 'string',
      note: 'string',
      icon: 'string',
      url: 'string',
      required: false
    }
  }
};

