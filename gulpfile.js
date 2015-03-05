'use strict';
var gulp = require('gulp');
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var argv = require('yargs').argv;
var fs = require('fs');

// HELPER FUNCTIONS
var isFlagPositive = function (value) {
  return value !== undefined && value !== 'false';
};

var isEnvEnabled = function (name) {
  return isFlagPositive(process.env[name]);
};

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// BUILD CONFIGURATION
var buildDir = '.tmp';
var buildPublicDir = '.tmp/public';

// BUILD SETTINGS
var production = isEnvEnabled('PRODUCTION');
var minifyCode = production || isEnvEnabled('MINIFY_CODE');
var npmProduction = isEnvEnabled('NPM_CONFIG_PRODUCTION');

var showFilesLog = true;

// LOG SETTINGS
console.log('Production mode: ' + production);
console.log('Minifying code: ' + minifyCode);
// The following means devDependencies are not installed
console.log('NPM in production mode: ' + npmProduction);

// Get gulp plugins
var conf = npmProduction ? {
  scope: ['dependencies']
} : undefined; //
var plugins = require('gulp-load-plugins')(conf);

gulp.task('default', ['build']);

gulp.task('build', ['build-css', 'build-js', 'merge-widget-configs',
  'copy-templates-json', 'build-template-images', 'copy-static-files']);

gulp.task('bower-install', ['generate-bower-json'], function () {
  return plugins.bower({cwd: ".tmp"}, [undefined, {
    "forceLatest": true
  }]).on('error', handleError);
});

// collect all bower-dependencies in collectedBowerDeps object
var collectedBowerDeps = {};
gulp.task('collect-bower-dependencies', function () {
  return gulp.src('assets/widgets/*/bower.json')
    .pipe(plugins.jsonEditor(function (json) {
      collectedBowerDeps[json.name] = "../assets/widgets/" + json.name + "/";
      return json;
    }))
    .on('error', handleError);
});

gulp.task('generate-bower-json', ['collect-bower-dependencies'], function () {
  return gulp.src('bower.json')
    .pipe(plugins.jsonEditor(function (json) {
      for (var dep in collectedBowerDeps) {
        json.dependencies[dep] = collectedBowerDeps[dep];
      }
      return json;
    }))
    .pipe(plugins.extend('bower.json'))
    .on('error', handleError)
    .pipe(gulp.dest('.tmp'));
});

gulp.task('build-components', ['bower-install'], function () {
  var removeFilter = plugins.filter([
    '**/*',
    '!**/test/**',
    '!**/examples/**',
    '!**/grunt/**',
    '!**/tests/**',
    '!**/*.md',
    '!**/*.gzip',
    '!**/*.scss',
    '!**/*.ts',
    '!**/*.coffee',
    '!**/package.json',
    '!**/grunt.js',
    '!**/bower.json'
  ]);

  return gulp.src('.tmp/bower_components/**/*')
    .pipe(plugins.cached('build-components'))
    .pipe(removeFilter)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'components'})))
    .on('error', handleError)
    .pipe(gulp.dest(buildPublicDir + '/components'));
});

gulp.task('build-css', ['build-less', 'build-components'], function () {
  if (!minifyCode) {
    return;
  }

  return gulp.src(buildPublicDir + '/**/*.css')
    .pipe(plugins.cached('build-css'))
    .on('error', handleError)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'CSS'})))
    .pipe(gulp.dest(buildPublicDir));
});

gulp.task('build-less', function () {
  return gulp.src('assets/css/**/*.less')
    .pipe(plugins.cached('build-less'))
    .pipe(gulp.dest(buildPublicDir + '/css'))
    .pipe(plugins.lessSourcemap())
    .on('error', handleError)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'LESS -> CSS'})))
    .pipe(gulp.dest(buildPublicDir + '/css'));
});

gulp.task('build-template-cache', function () {
  return gulp.src(['assets/**/*/*.html', 'assets/**/*/*.html'])
    .pipe(plugins.if(minifyCode, plugins.minifyHtml({empty: true})))
    .on('error', handleError)
    .pipe(gulp.dest(buildPublicDir))
    .pipe(plugins.angularTemplatecache('templates.js', {
      standalone: true,
      moduleSystem: 'RequireJS'
    }))
    .pipe(gulp.dest(buildPublicDir + '/js'));
});

gulp.task('copy-es6-polyfill', function () {
  return gulp.src('node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js')
    .pipe(plugins.rename('es6-polyfill.js'))
    .pipe(plugins.changed(buildPublicDir + '/js'))
    .pipe(gulp.dest(buildPublicDir + '/js'));
});

gulp.task('build-js', ['build-template-cache', 'build-widgets', 'build-components',
  'compile-js', 'annotate-js', 'copy-es6-polyfill'], function () {
  if (!minifyCode) {
    return;
  }

  return gulp.src(buildPublicDir + '/**/*.js')
    .pipe(plugins.cached('build-js'))
    .pipe(plugins.plumber())
    .pipe(plugins.if(minifyCode, plugins.uglify()))
    .on('error', handleError)
    .pipe(plugins.if(showFilesLog, plugins.size({showFiles: true, title: 'JS'})))
    .pipe(gulp.dest(buildPublicDir));
});

gulp.task('compile-js', function () {
  return gulp.src('assets/js/**/*.js')
    .pipe(plugins.cached('compile-js'))
    .pipe(plugins.changed(buildPublicDir + '/js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.if(function (file) {
        return file.relative !== 'main.js';
      },
      plugins.babel({modules: 'system'}),
      plugins.babel())
     ).on('error', handleError)
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(buildPublicDir + '/js'));
});

gulp.task('annotate-js', ['build-template-cache', 'build-widgets-js', 'build-components', 'compile-js'], function () {
  return gulp.src([buildPublicDir + '/**/*.js', '!' + buildPublicDir + '/components/**/*'])
    .pipe(plugins.cached('annotate-js'))
    .pipe(plugins.ngAnnotate())
    .on('error', handleError)
    .pipe(gulp.dest(buildPublicDir));
});

gulp.task('move-widgets', function () {
  // Move everything except JS-code which is handled separately in build-widgets-js
  return gulp.src(['assets/widgets/**', '!assets/widgets/**/*.js'])
    .pipe(plugins.cached('move-widgets'))
    .pipe(plugins.changed(buildPublicDir + '/widgets'))
    .pipe(gulp.dest(buildPublicDir + '/widgets'));
});

gulp.task('build-widgets-js', ['move-widgets'], function () {
  return gulp.src('assets/widgets/**/*.js')
    .pipe(plugins.cached('build-widgets-js'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .on('error', handleError)
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(buildPublicDir + '/widgets'));
});

gulp.task('build-widgets', ['move-widgets', 'build-widgets-js']);

gulp.task('merge-widget-configs', function () {
  return gulp.src('assets/widgets/**/widget.json')
    .pipe(plugins.tap(function (file) {
      var dir = path.basename(path.dirname(file.path));
      file.contents = Buffer.concat([
        new Buffer('{\"' + dir + '\":'),
        file.contents,
        new Buffer('}')
      ]);
    }))
    .pipe(plugins.extend('widgets.json'))
    .on('error', handleError)
    .pipe(gulp.dest(buildPublicDir + '/widgets'));
});

gulp.task('copy-templates-json', function () {
  return gulp.src('assets/templates/templates.json')
    .pipe(plugins.cached('copy-templates-json'))
    .pipe(gulp.dest(buildPublicDir + '/templates'));
});

gulp.task('build-template-images', function () {
  return gulp.src('assets/templates/**/icon.png')
    .pipe(plugins.cached('build-template-images'))
    .pipe(gulp.dest(buildPublicDir + '/templates'));
});

gulp.task('copy-static-files', function () {
  return gulp.src([
    'assets/img/**', 'assets/data/**',
    'assets/favicon.ico'], {base: 'assets'})
    .pipe(plugins.cached('copy-static-files'))
    .pipe(gulp.dest(buildPublicDir));
});

if (!npmProduction) {
  gulp.task('test', (isFlagPositive(argv.skipTests) ? [] :
    ['unit-test']), function (cb) {
    if (isEnvEnabled('SEND_COVERAGE')) {
      runSequence('coveralls', cb);
    } else {
      cb();
    }
  });

  gulp.task('unit-test', ['build', 'build-unit-test'], function (done) {
    var karma = require('karma').server;
    var conf = {
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    };
    conf.browsers = ['PhantomJS'];
    karma.start(conf, done);
  });

  gulp.task('build-unit-test', function () {
    return gulp.src('test/unit/**/*.js')
      .pipe(plugins.changed(buildPublicDir + '/test/unit'))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel())
      .pipe(plugins.sourcemaps.write('.'))
      .on('error', handleError)
      .pipe(gulp.dest(buildDir + '/test/unit'));
  });

  gulp.task('coveralls', function () {
    return gulp.src(buildDir + '/coverage/**/lcov.info')
      .pipe(plugins.replace(/SF:\./g, 'SF:./' + buildPublicDir))
      .pipe(plugins.coveralls());
  });

  gulp.task('e2e-test', ['e2e-run-test']);

  // Downloads the selenium webdriver
  gulp.task('webdriver-update', plugins.protractor.webdriver_update);

  gulp.task('e2e-run-test', ['webdriver-update', 'build', 'build-e2e-test'], function (cb) {
    var called = false;
    gulp.src([buildDir + '/test/e2e/**/*Spec.js'])
      .pipe(plugins.protractor.protractor({
        configFile: __dirname + '/protractor.conf.js'
      }))
      .on('error', function (e) {
        if (isEnvEnabled('CI') && !fs.existsSync('protractor.log')) {
          console.log('protractor.log not found!');
          console.log('Skipping end-to-end tests...');
          if (!called) {
            called = true;
            cb();
          }
        } else {
          throw e;
        }
      })
      .on('end', function () {
        if (!called) {
          called = true;
          cb();
        }
      });
  });

  gulp.task('build-e2e-test', function () {
    return gulp.src('test/e2e/**/*.js')
      .pipe(plugins.changed(buildDir + '/test/e2e'))
      .pipe(plugins.babel({modules: 'amd'}))
      .pipe(gulp.dest(buildDir + '/test/e2e'));
  });

  gulp.task('docs', function () {
    return plugins.shell.task([
      'node' +
      ' ' + path.join('node_modules', 'angular-jsdoc', 'node_modules', 'jsdoc', 'jsdoc.js') +
      ' -c ' + path.join('node_modules', 'angular-jsdoc', 'conf.json') + // config file
      ' -t ' + path.join('node_modules', 'angular-jsdoc', 'template') + // template file
      ' -d ' + path.join('docs') + // output directory
      ' -r ' + path.join('assets', 'js') + // source code directory
      ' README.md'
    ])().on('error', handleError);
  });

  var bump = function (importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
      // bump the version number in those files
      .pipe(plugins.bump({type: importance}))
      // save it back to filesystem
      .pipe(gulp.dest('./'))
      // commit the changed version number
      .pipe(plugins.git.commit('Bumps package version'))

      // read only one file to get the version number
      .pipe(plugins.filter('package.json'))
      // **tag it in the repository**
      .pipe(plugins.tagVersion());
  };

  gulp.task('patch', function () {
    return bump('patch');
  });

  gulp.task('feature', function () {
    return bump('minor');
  });

  gulp.task('release', function () {
    return bump('major');
  });

  // Rerun the task when a file changes
  gulp.task('watch', function () {
    return gulp.watch(['assets/**', 'test/**',
      'bower.json'], ['build']);
  });

  // Rerun the task when a file changes
  gulp.task('watch-unit-test', ['build'], function (done) {
    var karma = require('karma').server;
    var conf = {
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
    };
    if (process.env.CI) {
      conf.browsers = ['PhantomJS'];
    }
    karma.start(conf, done);
  });
}

gulp.task('clean', function (cb) {
  return del([
    buildDir
  ], cb);
});
