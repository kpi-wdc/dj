module.exports = function (config) {
  config.set({
    autoWatch: true,
    singleRun: true,
    colors: true,

    browsers: ['PhantomJS'],

    captureTimeout: 10000,
    reportSlowerThan: 5000,

    files: [
      '.tmp/public/js/es6-polyfill.js'
    ],

    frameworks: ['jasmine', 'jspm', 'phantomjs-shim'],

    reporters: ['progress', 'verbose', 'coverage'],

    jspm: {
      // Edit this to your needs
      config: 'assets/js/config.js',
      loadFiles: [
        'test/unit/*.js'
      ],
      serveFiles: [
        'assets/js/*.js',
        '.tmp/public/js/templates.js',
        '.tmp/public/components/**/*.js'
      ]
    },

    proxies: {
      '/base/js/templates.js': '/base/.tmp/public/js/templates.js',
      '/base/js': '/base/assets/js',
      '/base/components': '/base/.tmp/public/components',
      '/jspm_packages': '/base/jspm_packages'
    },

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit/*.js': ['babel', 'coverage'],
      'assets/js/*.js': ['babel', 'coverage']
    },

    coverageReporter: {
      type: 'lcov',
      dir: '.tmp/coverage/'
    }
  });
};
