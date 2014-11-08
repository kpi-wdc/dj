var gulp = require('gulp');
var bower = require('gulp-bower');
var run = require('gulp-run');
var flatten = require('gulp-flatten');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var gulpFilter = require('gulp-filter');
var ngAnnotate = require('gulp-ng-annotate');
var less = require('gulp-less-sourcemap');
var rename = require("gulp-rename");
var plumber = require('gulp-plumber');
var cached = require('gulp-cached');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var path = require('path');
var size = require('gulp-size');

var onHeroku = !!process.env.HEROKU_ENV;

gulp.task('default', ['build']);

gulp.task('bower', function () {
    return gulp.src('./')
        .pipe(cached('bower.json'))
        .pipe(run('bower install'));
});

gulp.task('build', ['less', 'components']);

gulp.task('components', ['bower'], function () {
    var nonMinJSFilter = gulpFilter(['**/*.js', '!**/*.min.js']);
    var removeFilter = gulpFilter([
        '**/*',
        '!**/src/**',
        '!**/test/**',
        '!**/examples/**',
        '!**/grunt/**',
        '!**/*.md',
        '!**/*.gzip',
        '!**/*.scss',
        '!**/package.json',
        '!**/grunt.js',
        '!**/bower.json'
    ]);

    return gulp.src('bower_components/**/*')
        .pipe(cached('bower_components'))
        .pipe(removeFilter)
        .pipe(nonMinJSFilter)
        .pipe(gulpif(onHeroku, ngAnnotate()))
        // TODO: add source maps
        .pipe(gulpif(onHeroku, uglify()))
        .pipe(nonMinJSFilter.restore())
        // gulp-filter not used because of some strange bug with css filter
        .pipe(gulpif(onHeroku, gulpif(/.*\.css$/, minifyCSS())))
        .pipe(size({showFiles: true, title: 'components'}))
        .pipe(gulp.dest('build/components'));
});

gulp.task('less', function () {
    var cssFilter = gulpFilter(['**/*.css']);
    gulp.src('WEB-INF/less/**/*.less')
        .pipe(cached('less'))
        .pipe(gulp.dest('build/css'))
        .pipe(less())
        .pipe(cssFilter)
        .pipe(gulpif(onHeroku, minifyCSS()))
        .pipe(cssFilter.restore())
        .pipe(gulp.dest('build/css'));
});

gulp.task('clean', function (cb) {
   return del([
       'build',
       'bower_components'
       ], cb);
});
