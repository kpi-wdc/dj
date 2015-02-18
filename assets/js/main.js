require.config({
  baseUrl: '/',
  // alias libraries paths.
  // IMPORTANT NOTE: don't add slash before components
  // (use components instead of /components)
  paths: {
    'jquery': 'components/jquery/dist/jquery.min',
    'angular': 'components/angular/angular.min',
    'angular-mocks': 'components/angular-mocks/angular-mocks',
    'template-cached-pages': 'js/templates',
    'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router.min',
    'ngstorage': 'components/ngstorage/ngStorage.min',
    'angular-oclazyload': 'components/oclazyload/dist/ocLazyLoad.min',
    'angular-foundation': 'components/angular-foundation/mm-foundation-tpls.min',
    'angular-json-editor': 'components/angular-json-editor/dist/angular-json-editor.min',
    'json-editor': 'components/json-editor/dist/jsoneditor.min',
    'leaflet': 'components/leaflet/dist/leaflet.min',
    'angular-leaflet': 'components/angular-leaflet/dist/angular-leaflet-directive.min',
    'sceditor': 'components/SCEditor/minified/jquery.sceditor.min'
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
    'angular-json-editor': ['angular', 'json-editor']
  },

  // kick start application
  deps: ['js/app']
});

(function () {
  // are we unit-testing now?
  let isUnitTesting = window.__karma__ !== undefined;
  if (isUnitTesting) {
    let tests = [];
    for (let file in window.__karma__.files) {
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
    });
  }
})();
