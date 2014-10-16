require.config({
    baseUrl: '/js',

    // alias libraries paths.  Must set 'angular'
    paths: {
        'angular': '/components/angular/angular.min',
        'angular-ui-router': '/components/angular-ui-router/release/angular-ui-router.min',
        'oclazyload': '/components/oclazyload/dist/ocLazyLoad.min'
    },

    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': ['angular'],
        'oclazyload': ['angular']
    },

    // kick start application
    deps: ['app']
});
