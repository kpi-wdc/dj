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
    'angular-cookies': 'components/angular-cookies/angular-cookies',

    // Standard libs for widgets:
    'sceditor': 'components/SCEditor/src/jquery.sceditor',
    'leaflet': 'components/leaflet/dist/leaflet',
    'angular-leaflet': 'components/angular-leaflet/dist/angular-leaflet-directive',
    'd3': 'components/d3/d3',
    'jsinq': "components/jsinq/source/jsinq",
    'jsinq-query': "components/jsinq/source/jsinq-query",
    'json-stat': 'components/jsonstat/json-stat.max',
    'nv.d3': 'components/nvd3/nv.d3'
  },

  // Add angular modules that does not support AMD out of the box, put it in a shim
  shim: {
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    },
    'jquery': {
      exports: '$'
    },
    'json-editor': {
      deps: ['sceditor'],
      exports: 'JSONEditor'
    },
    'angular-mocks': ['angular'],
    'angular-ui-router': ['angular'],
    'ngstorage': ['angular'],
    'angular-oclazyload': ['angular'],
    'angular-foundation': ['angular'],
    'angular-json-editor': ['angular', 'json-editor'],
    'angular-cookies': ['angular'],

    // Non-required by core (widgets):

    'sceditor': ['jquery'],
    'leaflet': {
      exports: 'L'
    },
    'angular-leaflet': ['angular', 'leaflet'],
    'd3': {
      exports: 'd3'
    },
    'jsinq': {
      exports: 'jsinq'
    },
    'jsinq-query': {
      deps: ['jsinq']
    },
    'json-stat': {
      exports: 'JSONstat'
    },
    'nv.d3': {
      exports: 'nv',
      deps: ['d3']
    }
  }
});

(function () {
  // are we unit-testing now?
  const isUnitTesting = window.__karma__ !== undefined;
  if (isUnitTesting) {
    const tests = [];
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
