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
var extend = require('gulp-extend');
var tap = require('gulp-tap');
var jeditor = require("gulp-json-editor");
var shell = require('gulp-shell');
var to5 = require('gulp-6to5');
var rename = require('gulp-rename');

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

gulp.task('build', ['build-html', 'build-css', 'build-js', 'build-favicon', 'merge-widget-configs']);

gulp.task('bower-install', ['generate-bower-json'], function () {
    return bower({}, [undefined, {
        "forceLatest": true
    }]).on('error', handleError);
});

// collect all bower-dependencies in collectedBowerDeps object
var collectedBowerDeps = {};
gulp.task('collect-bower-dependencies', function () {
    return gulp.src('resources/widgets/*/bower.json')
        .pipe(jeditor(function(json) {
            // TODO: if necessary don't add widgets with no dependencies at all
            collectedBowerDeps[json.name] = "./resources/widgets/" + json.name + "/";
            return json;
        }))
        .on('error', handleError);
});

gulp.task('generate-bower-json', ['collect-bower-dependencies'], function () {
    return gulp.src('bower-base.json')
        .pipe(jeditor(function(json) {
            for (var dep in collectedBowerDeps) {
                json.dependencies[dep] = collectedBowerDeps[dep];
            }
            return json;
        }))
        .pipe(extend('bower.json'))
        .on('error', handleError)
        .pipe(gulp.dest('.'))
});

gulp.task('build-components', ['bower-install'], function () {
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
            standalone: true,
            moduleSystem: 'RequireJS'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('copy-es6-polyfill', function () {
    return gulp.src('node_modules/gulp-6to5/node_modules/6to5/browser-polyfill.js')
        .pipe(cached('copy-es6-polyfill'))
        .pipe(rename('es6-polyfill.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('build-js', ['build-template-cache', 'build-widgets', 'build-components',
    'compile-js', 'annotate-js', 'movetest', 'copy-es6-polyfill'].concat(mergeJS ? ['amd-merge'] : []), function () {
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

gulp.task('compile-js', function () {
    return gulp.src('WEB-INF/js/**/*.js')
        .pipe(cached('compile-js'))
        .pipe(to5())
        .on('error', handleError)
        .pipe(gulp.dest('build/js'));
});

gulp.task('movetest', function () {
    return gulp.src('test/**/*.js')
        .pipe(cached('movetest'))
        .pipe(gulp.dest('build/test'));
});

gulp.task('annotate-js', ['build-template-cache', 'build-widgets', 'build-components', 'compile-js'], function () {
    return gulp.src('build/**/*.js')
        .pipe(cached('annotate-js'))
        .pipe(ngAnnotate())
        .on('error', handleError)
        .pipe(gulp.dest('build'));
});

gulp.task('move-widgets', function () {
    return gulp.src('resources/widgets/**')
        .pipe(cached('move-widgets'))
        .pipe(gulp.dest('build/widgets'));
});

gulp.task('build-widgets-js', ['move-widgets'], function () {
    return gulp.src('build/widgets/**/*.js')
        .pipe(cached('build-widgets-js'))
        .pipe(to5())
        .on('error', handleError)
        .pipe(gulp.dest('build/widgets'));
});

gulp.task('build-widgets', ['move-widgets', 'build-widgets-js']);

gulp.task('amd-merge', ['amd-optimize'], function () {
    return gulp.src(['build/js/compiled.js', 'build/js/main.js'])
        .pipe(cached('amd-merge'))
        .pipe(concat('main.js'))
        .on('error', handleError)
        .pipe(gulp.dest('build/js'));
});

gulp.task('amd-optimize', ['build-components', 'build-widgets',
    'compile-js', 'build-template-cache', 'annotate-js', 'copy-es6-polyfill'], function () {
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

gulp.task('merge-widget-configs', function () {
    return gulp.src('resources/widgets/**/widget.json')
        .pipe(tap(function(file) {
            var dir = path.basename(path.dirname(file.path));
            file.contents = Buffer.concat([
                new Buffer('{\"' + dir + '\":'),
                file.contents,
                new Buffer('}')
            ]);
        }))
        .pipe(extend('widgets.json'))
        .on('error', handleError)
        .pipe(gulp.dest('build/widgets'))
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

gulp.task('e2e-test', ['e2e-run-test']);

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

gulp.task('docs', shell.task([
    path.join('node', 'node') +
    ' ' + path.join('node_modules', 'angular-jsdoc', 'node_modules', 'jsdoc', 'jsdoc.js') +
    ' -c ' + path.join('node_modules', 'angular-jsdoc', 'conf.json') + // config file
    ' -t ' + path.join('node_modules', 'angular-jsdoc', 'template') + // template file
    ' -d ' + path.join('build', 'docs') + // output directory
    ' -r ' + path.join('WEB-INF', 'js') + // source code directory
    ' ' + path.resolve('..', '..', '..', 'README.md') // index.html text
]));

// Rerun the task when a file changes
gulp.task('watch', function () {
    return gulp.watch(['WEB-INF/**', 'resources/**', 'test/**',
        'bower-base.json', 'favicon.ico', '!resources/apps/**',
        '!resources/widgets/widgets.json'], ['build', 'docs']);
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
       'bower_components',
       'bower.json'
       ], cb);
});
