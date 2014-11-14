module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      {pattern: 'build/widgets/**/*.js', included: false},
      {pattern: 'build/js/*.js', included: false},
      {pattern: 'build/components/**/*.js', included: false},
      {pattern: 'test/**/*Spec.js', included: false},
      'test/test-main.js'
    ],

    exclude: [
      'build/js/main.js'
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
