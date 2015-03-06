import angular from 'angular';
const m = angular.module('app.widgets.data-util.keyset', []);

m.factory('KeySet', function () {

  var KeySet = function () {
    this.collection = [];
  };

  KeySet.prototype = {
    _getIndex: function (category) {
      for (var i in this.collection) {
        if (this.collection[i] === category) {
          return i;
        }
      }
      return undefined;
    },

    set: function (collection) {
      this.collection = collection;
    },

    contains: function (category) {
      return angular.isDefined(this._getIndex(category));
    },

    add: function (category) {
      var index = this._getIndex(category);
      if (angular.isUndefined(index)) {
        this.collection.push(category)
      }
    },

    remove: function (category) {
      var index = this._getIndex(category);
      if (angular.isDefined(index)) {
        this.collection.splice(index, 1);
      }
    },

    toArray: function () {
      return this.collection;
    },

    length: function () {
      return this.collection.length;
    }
  };

  return KeySet;

});
