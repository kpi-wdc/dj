/**
 * Dataset.js
 *
 * @description :: Model for dataset
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    
    'commit/author': {
      type:'string',
      required: false
    },

    'commit/HEAD': {
      type:'boolean',
      required: false
    },

    "dataset/id": {
      type:'string',
      required: false
    },

    "dataset/status": {
      type:'string',
      required: false
    },
    
    metadata: {
      type: 'json',
      required: true
    },
    
    data: {
      type: 'json',
      required: false
    },

    createdAt: {
      type: 'datetime',
      defaultsTo: function (){ return new Date(); }
    }
  },

  beforeCreate: function(values,cb){
    values["dataset/id"] = values.metadata.dataset.id;
    values["dataset/status"] = values.metadata.dataset.status;
    values["commit/HEAD"] = true;
    values["commit/author"] = values.metadata.dataset.commit.author;
    cb();
  }
};
