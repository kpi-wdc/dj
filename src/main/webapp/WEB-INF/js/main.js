require.config({
    baseUrl: '/js',

    // alias libraries paths.  Must set 'angular'
    paths: {
        'angular': '/components/angular/angular',
        'angular-ui-router': '/components/angular-ui-router/release/angular-ui-router',
        'angular-oclazyload': '/components/oclazyload/dist/ocLazyLoad',
        'angular-foundation': '/components/angular-foundation/mm-foundation-tpls'
    },

    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-router': ['angular'],
        'angular-oclazyload': ['angular'],
        'angular-foundation': ['angular']
    },

    // kick start application
    deps: ['app']
});
