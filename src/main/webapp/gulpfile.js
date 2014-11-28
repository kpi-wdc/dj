'use strict';
var gulp = require('gulp');
var run = require('gulp-run');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var gulpFilter = require('gulp-filter');
var ngAnnotate = require('gulp-ng-annotate');
var less = require('gulp-less-sourcemap');
var glob = require('glob');
var cached = require('gulp-cached');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var bower = require('gulp-bower');
var path = require('path');
var minifyHTML = require('gulp-minify-html');
var size = require('gulp-size');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var rjs = require('gulp-requirejs');
var inlinesource = require('gulp-inline-source');
var runSequence = require('run-sequence');
var karma = require('karma').server;
var protractor = require('gulp-protractor').protractor;
var coveralls = require('gulp-coveralls');
var replace = require('gulp-replace');
var webdriver_update = require('gulp-protractor').webdriver_update;
var argv = require('yargs').argv;
var sauceConnectLauncher = require('sauce-connect-launcher');
var extend = require('gulp-extend');
var tap = require('gulp-tap');

var isFlagPositive = function (value) {
    return value !== undefined && value !== 'false';
};

var isEnvEnabled = function (name) {
    return isFlagPositive(process.env[name]);
};


var production = isEnvEnabled('PRODUCTION');
var minifyCode = production || isEnvEnabled('MINIFY_CODE');
var mergeJS = production || isEnvEnabled('MERGE_JS');
var inlineJSandCSS = mergeJS && minifyCode;

var showFilesLog = false;

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('default', ['build']);

gulp.task('bower', function () {
    return bower().on('error', handleError);
});

gulp.task('build', ['build-html', 'build-css', 'build-js', 'build-favicon', 'merge-widget-configs']);

gulp.task('build-components', ['bower'], function () {
    var removeFilter = gulpFilter([
        '**/*',
        '!**/jquery/src/**',
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

    return gulp.src('bower_components/**/*')
        .pipe(cached('bower_components'))
        .pipe(removeFilter)
        .pipe(gulpif(showFilesLog, size({showFiles: true, title: 'components'})))
        .on('error', handleError)
        .pipe(gulp.dest('build/components'));
});

gulp.task('build-css', ['build-less', 'build-components'], function () {
    return gulp.src('build/**/*.css')
        .pipe(cached('build-css'))
        .pipe(gulpif(minifyCode, minifyCSS()))
        .on('error', handleError)
        .pipe(gulpif(showFilesLog, size({showFiles: true, title: 'CSS'})))
        .pipe(gulp.dest('build'))
});

gulp.task('build-less', function () {
    return gulp.src('WEB-INF/less/**/*.less')
        .pipe(cached('build-less'))
        .pipe(gulp.dest('build/css'))
        .pipe(less())
        .on('error', handleError)
        .pipe(gulpif(showFilesLog, size({showFiles: true, title: 'LESS -> CSS'})))
        .pipe(gulp.dest('build/css'));
});

gulp.task('build-html', ['build-js', 'build-css'], function () {
    return gulp.src('WEB-INF/index.html')
        .pipe(gulpif(inlineJSandCSS, inlinesource({
            rootpath: 'build'
        })))
        .pipe(gulpif(minifyCode, minifyHTML({empty: true})))
        .on('error', handleError)
        .pipe(gulpif(showFilesLog, size({showFiles: true, title: 'HTML'})))
        .pipe(gulp.dest('build'));
});

gulp.task('build-template-cache', function () {
    return gulp.src(['WEB-INF/**/*/*.html', 'resources/**/*/*.html'])
        .pipe(gulpif(minifyCode, minifyHTML({empty: true})))
        .on('error', handleError)
        .pipe(gulp.dest('build'))
        .pipe(templateCache('templates.js', {
            standalone: true
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('build-js', ['build-template-cache', 'build-widgets', 'build-components',
    'movejs', 'annotate-js', 'movetest'].concat(mergeJS ? ['amd-merge'] : []), function () {
    var nonTestJSFilter = gulpFilter(['!test/**/*.js']);
    return gulp.src(['build/**/*.js'])
        .pipe(cached('build-js'))
        .pipe(nonTestJSFilter)
        .pipe(gulpif(minifyCode, uglify()))
        .on('error', handleError)
        .pipe(nonTestJSFilter.restore())
        .pipe(gulpif(showFilesLog, size({showFiles: true, title: 'JS'})))
        .pipe(gulp.dest('build'));
});

gulp.task('movejs', function () {
    return gulp.src('WEB-INF/js/**/*.js')
        .pipe(cached('movejs'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('movetest', function () {
    return gulp.src('test/**/*.js')
        .pipe(cached('movetest'))
        .pipe(gulp.dest('build/test'));
});

gulp.task('annotate-js', ['build-template-cache', 'build-widgets', 'build-components', 'movejs'], function () {
    return gulp.src('build/**/*.js')
        .pipe(cached('annotate-js'))
        .pipe(ngAnnotate())
        .on('error', handleError)
        .pipe(gulp.dest('build'));
});

gulp.task('build-widgets', function () {
    return gulp.src(['resources/widgets/**'])
        .pipe(cached('build-widgets'))
        .pipe(gulp.dest('build/widgets'));
});

gulp.task('amd-merge', ['amd-optimize'], function () {
    return gulp.src(['build/js/compiled.js', 'build/js/main.js'])
        .pipe(cached('amd-merge'))
        .pipe(concat('main.js'))
        .on('error', handleError)
        .pipe(gulp.dest('build/js'));
});

gulp.task('amd-optimize', ['build-components', 'build-widgets',
    'movejs', 'build-template-cache', 'annotate-js'], function () {
    return gulp.src(['build/**/*.js'], {
            base: 'build'
        })
        .pipe(rjs({
            mainConfigFile: 'build/js/main.js',
            out: 'js/compiled.js',
            name: 'js/app',
            include: glob.sync('widgets/**/widget.js', {
                cwd: 'build'
            }),
            baseUrl: 'build'
        }))
        .on('error', handleError)
        .pipe(gulpif(showFilesLog, size({showFiles: true, title: 'amd-optimize'})))
        .pipe(gulp.dest('build'));
});

gulp.task('build-favicon', function () {
    return gulp.src('favicon.ico')
        .pipe(cached('build-favicon'))
        .pipe(gulp.dest('build'));
});

gulp.task('test', (isFlagPositive(argv.skipTests) ? []:
    ['unit-test', 'e2e-test']), function (cb) {
    // disable tests on heroku or when --skipTests=true is passed
    if (isFlagPositive(argv.skipTests)) {
        console.log('Skipping tests because skipTests flag is passed');
        cb();
        return;
    }
    if (isEnvEnabled('SEND_COVERAGE')) {
        runSequence('coveralls', cb);
    } else {
        cb();
    }
});

gulp.task('unit-test', [], function (done) {
    var conf = {
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    };
    conf.browsers = ['PhantomJS'].concat(isEnvEnabled('CI') ? 'Firefox' : []);
    karma.start(conf, done);
});

gulp.task('coveralls', function () {
    return gulp.src('build/coverage/**/lcov.info')
        .pipe(replace(/SF:\./g, 'SF:./build'))
        .pipe(gulp.dest('build/omg'))
        .pipe(coveralls());
});

var sauceConnectProcess = undefined;

gulp.task('run-sauce', function (cb) {
    sauceConnectLauncher({}, function (err, _sauceConnectProcess) {
        if (err) {
            console.error(err.message);
            throw err.message;
        }
        console.log('Sauce Connect ready');
        sauceConnectProcess = _sauceConnectProcess;
        cb();
    });
});

gulp.task('stop-sauce', function (cb) {
    sauceConnectProcess.close(function () {
        console.log('Closed Sauce Connect process');
        cb();
    })
});

gulp.task('e2e-test', function (cb) {
    // Disable SAUCE usage because of travis instability.
    //if (process.env.SAUCE_USERNAME) {
    //    runSequence('run-sauce', 'e2e-run-test', 'stop-sauce', cb);
    //} else {
        runSequence('e2e-run-test', cb);
    //}
});

// Downloads the selenium webdriver
gulp.task('webdriver-update', webdriver_update);

gulp.task('e2e-run-test', ['webdriver-update'], function () {
    return gulp.src(['build/test/e2e/**/*Spec.js'])
        .pipe(protractor({
            configFile: __dirname + '/protractor.conf.js'
        }))
        .on('error', function(e) {
            if (isEnvEnabled('CI') &&
                /Timed out waiting for the WebDriver server/.test(e.message)) {
                console.log(e);
                console.log('Skipping end-to-end tests...')
            } else {
                throw e;
            }
        });
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    return gulp.watch(['WEB-INF/**', 'resources/**', 'test/**',
        'bower.json', 'favicon.ico', '!resources/apps/**',
        '!resources/widgets/widgets.json'], ['build']);
});

// Rerun the task when a file changes
gulp.task('watch-unit-test', ['build'], function (done) {
    var conf = {
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    };
    if (process.env.CI) {
        conf.browsers = ['PhantomJS'];
    }
    karma.start(conf, done);
});

gulp.task('clean', function (cb) {
   return del([
       'build',
       'bower_components'
       ], cb);
});

gulp.task('merge-widget-configs', function () {
    return gulp.src('resources/widgets/**/widget.json')
        .pipe(tap(function(file) {
            var dir = path.dirname(file.path).split('/').pop();
            file.contents = Buffer.concat([
                new Buffer('{\"' + dir + '\":'),
                file.contents,
                new Buffer('}')
            ]);
        }))
        .pipe(extend('widgets.json'))
        .pipe(gulp.dest('build/widgets'))
});
