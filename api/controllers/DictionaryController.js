/**
 * DictionaryController
 *
 * @description :: Server-side logic for managing Dictionary
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

  getDictionary: function(req, res) {
    // get req.params.type as array of string
    // fetch data from dictionary collection where type in req.params.type array
    // if req.params.type is undefined or req.params.type == [] fetch all data
    // send fetched data

    dictionaryTypes = req.params.type;
    if (!dictionaryTypes) {
      return res.badRequest('Request contains no type');
    }

    Dictionary.find({
      'value.type' : dictionaryTypes
    }).then(function (json) {
      if (json) {
        return res.send(json);
      } else {
        return res.send([]);
      }
    });
  },

  getAllDictionaries: function(req, res) {
    Dictionary.find({}).then(function (json) {
      return res.send(json);
    });
  }

};

