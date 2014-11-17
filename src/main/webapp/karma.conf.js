module.exports = function(config){
  config.set({

    basePath : './build',

    files : [
      {pattern: 'widgets/**/*.js', included: false},
      {pattern: 'js/*.js', included: false},
      {pattern: 'components/**/*.js', included: false},
      {pattern: 'test/unit/**/*Spec.js', included: false},
      'test/unit/test-main.js'
    ],

    exclude: [
      'js/main.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine', 'requirejs'],

    browsers : ['PhantomJS'],

    singleRun: true,

    captureTimeout: 10000,

    reportSlowerThan: 5000,

    reporters: ['progress', 'coverage'],

    preprocessors: {
      '!(components|test)/**/*.js': ['coverage']
    },

    coverageReporter: {
        type : 'html',
        dir : 'coverage/'
    },

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-requirejs',
            'karma-coverage',
            'karma-junit-reporter'
            ]
  });
};
