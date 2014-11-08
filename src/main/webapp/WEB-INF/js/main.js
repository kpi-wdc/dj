require.config({
    baseUrl: '/',
    // alias libraries paths.  Must set 'angular'
    paths: {
        'angular': 'components/angular/angular',
        'template-cached-pages': 'js/templates',
        'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router',
        'angular-oclazyload': 'components/oclazyload/dist/ocLazyLoad',
        'angular-foundation': 'components/angular-foundation/mm-foundation-tpls',
        'leaflet': 'components/leaflet/dist/leaflet',
        'angular-leaflet': 'components/angular-leaflet/dist/angular-leaflet-directive'
    },

    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },
        'leaflet': {
            exports: 'L'
        },
        'angular-leaflet': ['angular', 'leaflet'],
        'angular-ui-router': ['angular'],
        'angular-oclazyload': ['angular'],
        'angular-foundation': ['angular'],
        'template-cached-pages': ['angular']
    },

    // kick start application
    deps: ['js/app']
});
