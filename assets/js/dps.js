import angular from 'angular';

const dps = angular.module('app.dps', ['app.config']);

dps.run (function(config, $location){
  config.dps = config.dps || $location.protocol()+'://'+$location.host()+":"+$location.port();

  console.log("Data Processing Server URL", config.dps);
})

dps.service('$dps',

   	function($http,config, $location){
   	    var dpsURL = config.dps || $location.protocol()+'://'+$location.host()+":"+$location.port();
		angular.extend(this,
			{
				get : function(url,config){
					// $http.jsonp(dpsURL+url+"?callback=JSON_CALLBACK",config)
					// .then(function(data,status){
					// 	console.log(dpsURL+url+"?callback=JSON_CALLBACK");
					// 	console.log(data)
					// 	console.log(status)
					// })
					// return $http.jsonp(dpsURL+url+"?callback=JSON_CALLBACK",config)
					return $http.get(dpsURL+url,config)
				},
				
				post : function (url,config){
					return $http.post(dpsURL+url, config)
				},

				getUrl: function(){
					return dpsURL
				}
			}
		)
});
  
