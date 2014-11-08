require.config({
    paths: {
        'leaflet': '/components/leaflet/dist/leaflet',
        'angular-leaflet': '/components/angular-leaflet/dist/angular-leaflet-directive'
    },
    shim: {
        'leaflet': {
            exports: 'L'
        },
        'angular-leaflet': {
            deps: ['leaflet']
        }
    }
});

define(['angular', 'angular-leaflet'], function (angular) {
    angular.module('app.widgets.leaflet-map', ['leaflet-directive', {files: ['/components/leaflet/dist/leaflet.css']}])
//        .controller('LeafletMapController', function ($scope) {
//        });
});
