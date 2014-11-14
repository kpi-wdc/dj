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
var concat = require("gulp-concat");
var rjs = require('gulp-requirejs');
var inlinesource = require('gulp-inline-source');
var karma = require('karma').server;

var onHeroku = Boolean(process.env.HEROKU_ENV);
var minifyCode = onHeroku || Boolean(process.env.MINIFY_CODE);
var mergeJS = onHeroku || Boolean(process.env.MERGE_JS);
var inlineJSandCSS = mergeJS && minifyCode;

gulp.task('default', ['build']);

gulp.task('bower', function () {
    return bower();
});

gulp.task('build', ['build-html', 'build-css', 'build-js', 'build-favicon']);

gulp.task('build-components', ['bower'], function () {
    var removeFilter = gulpFilter([
        '**/*',
        '!**/src/**',
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
        .pipe(size({showFiles: true, title: 'components'}))
        .pipe(gulp.dest('build/components'));
});

gulp.task('build-css', ['build-less', 'build-components'], function () {
    gulp.src('build/**/*.css')
        .pipe(cached('build-css'))
        .pipe(gulpif(minifyCode, minifyCSS()))
        .pipe(size({showFiles: true, title: 'CSS'}))
        .pipe(gulp.dest('build'))
});

gulp.task('build-less', function () {
    return gulp.src('WEB-INF/less/**/*.less')
        .pipe(cached('build-less'))
        .pipe(gulp.dest('build/css'))
        .pipe(less())
        .pipe(size({showFiles: true, title: 'LESS -> CSS'}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('build-html', ['build-js', 'build-css'], function () {
    return gulp.src('WEB-INF/index.html')
        .pipe(gulpif(inlineJSandCSS, inlinesource({
            rootpath: 'build'
        })))
        .pipe(gulpif(minifyCode, minifyHTML({empty: true})))
        .pipe(size({showFiles: true, title: 'HTML'}))
        .pipe(gulp.dest('build'));
});

gulp.task('build-template-cache', function () {
    return gulp.src(['WEB-INF/**/*/*.html', 'resources/**/*/*.html'])
        .pipe(gulpif(minifyCode, minifyHTML({empty: true})))
        .pipe(gulp.dest('build'))
        .pipe(templateCache('templates.js', {
            standalone: true
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('build-js', ['build-template-cache', 'build-widgets', 'build-components',
    'movejs', 'annotate-js', 'movetest'].concat(mergeJS ? ['amd-merge'] : []), function () {
    var nonTestJSFilter = gulpFilter(["!test/**/*.js"]);
    return gulp.src(['build/**/*.js'])
        .pipe(cached('build-js'))
        .pipe(nonTestJSFilter)
        .pipe(gulpif(minifyCode, uglify()))
        .pipe(nonTestJSFilter.restore())
        .pipe(size({showFiles: true, title: 'JS'}))
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
        .pipe(gulp.dest('build'));
});

gulp.task('build-widgets', function () {
    return gulp.src(['resources/widgets/**'])
        .pipe(cached('build-widgets'))
        .pipe(gulp.dest('build/widgets'));
});

gulp.task('amd-merge', ['amd-optimize'], function () {
    gulp.src(['build/js/compiled.js', 'build/js/main.js'])
        .pipe(cached('amd-merge'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('amd-optimize', ['build-components', 'build-widgets',
    'movejs', 'build-template-cache', 'annotate-js'], function () {
    return gulp.src(['build/**/*.js'], {
            base: 'build'
        })
        .pipe(size({showFiles: true, title: 'amd-optimize'}))
        .pipe(rjs({
            mainConfigFile: "build/js/main.js",
            out: "js/compiled.js",
            name: "js/app",
            include: glob.sync("widgets/**/widget.js", {
                cwd: "build"
            }),
            baseUrl: "build"
        }))
        .pipe(size({showFiles: true, title: 'amd-optimize'}))
        .pipe(gulp.dest('build'));
});

gulp.task('build-favicon', function () {
    return gulp.src('favicon.ico')
        .pipe(cached('build-favicon'))
        .pipe(gulp.dest('build'));
});

/**
 * Run test once and exit
 */
gulp.task('test', ['build'], function (done) {
    var conf = {
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    };
    if (process.env.CI) {
        conf.browsers = [(process.env.CI ? 'Firefox' : 'Chrome'), 'PhantomJS'];
    }
    karma.start(conf, done);
});

// Rerun the task when a file changes
gulp.task('watch', ['build'], function() {
    return gulp.watch(['WEB-INF/**', 'resources/**', 'bower.json', 'favicon.ico', '!resources/apps/**'], ['build']);
});

// Rerun the task when a file changes
gulp.task('watch-test', ['build'], function (done) {
    var conf = {
        configFile: __dirname + '/karma.conf.js'
    };
    if (process.env.CI) {
        conf.browsers = [(process.env.CI ? 'Firefox' : 'Chrome'), 'PhantomJS'];
    }
    karma.start(conf, done);
});

gulp.task('clean', function (cb) {
   return del([
       'build',
       'bower_components'
       ], cb);
});
