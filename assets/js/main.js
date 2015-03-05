System.config({
  baseURL: '/',
  // alias libraries paths.
  // IMPORTANT NOTE: don't add slash before components
  // (use components instead of /components)
  paths: {
    'app': 'js/app.js',
    'app-list': 'js/app-list.js',
    'info': 'js/info.js',
    'shims': 'js/shims.js',
    'widget-api': 'js/widget-api.js',
    'template-cached-pages': 'js/templates.js',

    'jquery': 'components/jquery/dist/jquery.js',
    'angular': 'components/angular/angular.js',
    'angular-mocks': 'components/angular-mocks/angular-mocks.js',
    'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router.js',
    'ngstorage': 'components/ngstorage/ngStorage.js',
    'angular-oclazyload': 'components/oclazyload/dist/ocLazyLoad.js',
    'angular-foundation': 'components/angular-foundation/mm-foundation-tpls.js',
    'angular-json-editor': 'components/angular-json-editor/src/angular-json-editor.js',
    'json-editor': 'components/json-editor/dist/jsoneditor.js',
    'angular-cookies': 'components/angular-cookies/angular-cookies.js',

    // Standard libs for widget.jss:
    'sceditor': 'components/SCEditor/src/jquery.sceditor.js',
    'leaflet': 'components/leaflet/dist/leaflet.js',
    'angular-leaflet': 'components/angular-leaflet/dist/angular-leaflet-directive.js',
    'd3': 'components/d3/d3.js',
    'jsinq': 'components/jsinq/source/jsinq.js',
    'jsinq-query': 'components/jsinq/source/jsinq-query.js',
    'json-stat': 'components/jsonstat/json-stat.max.js',
    'nv.d3': 'components/nvd3/nv.d3.js'
  },

  // Add angular modules that does not support AMD out of the box, put it in a shim
  meta: {
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
    'angular-mocks': {
      deps: ['angular']
    },
    'angular-ui-router': {
      deps: ['angular']
    },
    'ngstorage': {
      deps: ['angular']
    },
    'angular-oclazyload': {
      deps: ['angular']
    },
    'angular-foundation': {
      deps: ['angular']
    },
    'angular-json-editor': {
      deps: ['angular', 'json-editor']
    },
    'angular-cookies': {
      deps: ['angular']
    },

    // Non-required by core (widgets):

    'sceditor': {
      deps: ['jquery']
    },
    'leaflet': {
      exports: 'L'
    },
    'angular-leaflet': {
      deps: ['angular', 'leaflet']
    },
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
