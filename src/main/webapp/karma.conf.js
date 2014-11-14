module.exports = function(config){
  config.set({

    basePath : './build',

    files : [
      {pattern: 'widgets/**/*.js', included: false},
      {pattern: 'js/*.js', included: false},
      {pattern: 'components/**/*.js', included: false},
      {pattern: 'test/**/*Spec.js', included: false},
      'test/test-main.js'
    ],

    exclude: [
      'js/main.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine', 'requirejs'],

    browsers : ['Chrome', 'PhantomJS'],
    reporters: ['progress'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-requirejs',
            'karma-junit-reporter'
            ]
  });
};
