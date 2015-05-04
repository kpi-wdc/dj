"use strict";

// System.config({
//   paths: {
//     stat: "widgets/data-util/stat.js",
//     pca: "widgets/data-util/pca.js",
//     cluster: "widgets/data-util/cluster.js"
//   }
// });

define(["angular"], function (angular) {
  
  var m = angular.module("app.widgets.data-util.dps", []);

  m.factory('Requestor', function ($q, $timeout) {
    
    var Requestor = function(requestSequence){
      this.requestSequence = requestSequence || [];
    }
    
    Requestor.prototype = {
      
      push: function(label,executor){
        this.requestSequence.push({label:label,execute:executor});
        return this;
      },
      
      pop: function(label){
        var item;
        do{
          item = this.requestSequence.pop();
        } while (item.label == label || this.requestSequence.length == 0)
        return this;
      },

      clear: function(){
        this.requestSequence = [];
        return this;
      },

      set: function(requestSequence){
        this.requestSequence = requestSequence;
        return this;
      },


      execute: function(startData,callback){
            if(this.requestSequence.length == 0){
              if(callback) callback(startData)
              return  
            }
            this.index = 0;
            this.defferer = $q.defer();
            var thos = this;
            var q = function(value){
                thos.index++;
                if ( thos.index >= thos.requestSequence.length ){
                  if(callback) callback(value);
                  return;
                } 
                var r = thos.requestSequence[thos.index];
                thos.defferer = $q.defer();
                thos.defferer.promise.then(q);
                r.execute(thos,value);
                
              };

            this.defferer.promise.then(q);
            this.requestSequence[0].execute(this,startData);
        },
       resolve: function(value){
          this.defferer.resolve(value)
        }
      }
    return Requestor;
  });






});
