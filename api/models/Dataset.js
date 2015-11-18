/**
 * Dataset.js
 *
 * @description :: Model for dataset
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    metadata: {
      type: 'json',
      required: true,
    },
    data: {
      type: 'json',
      required: false
    }  
  }
};