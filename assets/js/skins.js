import angular from 'angular';

const skins = angular.module('app.skins', ['app.config']);
var list= [];
skins.run (function($http){
	$http
      .get("./api/app/skins")
      .then(function(resp){
        list = resp.data.map((item) => {return {title:item, name:item}});
      })
})

skins.factory("appSkins",function(){return list})

  
