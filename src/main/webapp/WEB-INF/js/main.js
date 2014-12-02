require.config({
    baseUrl: '/',
    // alias libraries paths.
    // IMPORTANT NOTE: don't add slash before components
    // (use components instead of /components)
    paths: {
        'jquery': 'components/jquery/dist/jquery',
        'angular': 'components/angular/angular',
        'angular-mocks': 'components/angular-mocks/angular-mocks',
        'template-cached-pages': 'js/templates',
        'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router',
        'ngstorage': 'components/ngstorage/ngStorage',
        'angular-oclazyload': 'components/oclazyload/dist/ocLazyLoad',
        'angular-foundation': 'components/angular-foundation/mm-foundation-tpls',
        'angular-json-editor': 'components/angular-json-editor/src/angular-json-editor',
        'json-editor': 'components/json-editor/dist/jsoneditor',
        'leaflet': 'components/leaflet/dist/leaflet',
        'angular-leaflet': 'components/angular-leaflet/dist/angular-leaflet-directive',
        'sceditor': 'components/SCEditor/src/jquery.sceditor'
    },

    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'leaflet': {
            exports: 'L'
        },
        'jquery': {
            exports: '$'
        },
        'json-editor': {
            deps: ['sceditor'],
            exports: 'JSONEditor'
        },
        'sceditor': ['jquery'],
        'angular-mocks': ['angular'],
        'angular-leaflet': ['angular', 'leaflet'],
        'angular-ui-router': ['angular'],
        'ngstorage': ['angular'],
        'angular-oclazyload': ['angular'],
        'angular-foundation': ['angular'],
        'angular-json-editor': ['angular', 'json-editor'],
        'template-cached-pages': ['angular']
    },

    // kick start application
    deps: ['js/app']
});

(function () {
    "use strict";
    // are we unit-testing now?
    var isUnitTesting = window.__karma__ !== undefined;
    if (isUnitTesting) {
        var tests = [];
        for (var file in window.__karma__.files) {
            if (window.__karma__.files.hasOwnProperty(file)) {
                if (/Spec\.js$/.test(file)) {
                    tests.push(file);
                }
            }
        }
        require.config({
            baseUrl: '/base',
            deps: tests,
            callback: window.__karma__.start
        })
    }
})();
