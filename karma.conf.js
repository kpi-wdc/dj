module.exports = function (config) {
  config.set({

    basePath: './.tmp/public',

    files: [
      'js/es6-polyfill.js',
      // HACK: manually inject RequireJS framework
      // otherwise it's impossible to load polyfills before other code
      // Note: RequireJS is not listed in `frameworks` property
      // END OF HACK
      'js/main.js',
      {pattern: 'js/*.js', included: false},
      {pattern: 'widgets/**/*.js', included: false},
      {pattern: 'components/**/*.js', included: false},
      {pattern: '../test/unit/**/*Spec.js', included: false}
    ],

    autoWatch: true,

    frameworks: ['jasmine', 'systemjs'],

    browsers: ['Firefox'],

    singleRun: true,

    captureTimeout: 10000,

    reportSlowerThan: 5000,

    reporters: ['progress', 'coverage'],

    preprocessors: {
      '!(components|test)/**/!(templates)*.js': ['coverage']
    },

    coverageReporter: {
      type: 'lcov',
      dir: '../coverage/'
    },

    client: {
      requireJsShowNoTimestampsError: false
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-systemjs',
      'karma-coverage',
      'karma-junit-reporter'
    ]
  });
};
