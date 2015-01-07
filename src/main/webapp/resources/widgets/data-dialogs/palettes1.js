require.config({
    paths: {
        'colors': 'widgets/data-dialogs/colorbrewer'
    },
    shim: {
        'colors':{
            exports: 'colorbrewer'
        }
    }
});



define(['angular','colors'], function (angular, colorbrewer) {

    var result = [];
    for(var i in colorbrewer){
        for(var j in colorbrewer[i]){
            result.push(colorbrewer[i][j])
        }
    }

    angular.module('app.widgets.palettes1', []).constant('Palettes1', result);

});
