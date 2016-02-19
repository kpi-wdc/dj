System.config({
  paths: {
    'colors': 'widgets/v2.steps/colorbrewer.js'
  },
  meta: {
    'colors': {
      exports: 'colorbrewer'
    }
  }
});

var Palettes;
define(['angular', 'colors'], function (angular, colorbrewer) {
  const result = [];
  for (var i in colorbrewer) {
    for (var j in colorbrewer[i]) {
      result.push(colorbrewer[i][j]);
    }
  }
  Palettes =  result;
  angular.module('app.widgets.palettes', []).constant('Palettes', result);
});
