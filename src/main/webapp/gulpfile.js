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

var onHeroku = !!process.env.HEROKU_ENV;

gulp.task('default', ['bower', 'build']);

gulp.task('bower', function () {
    return gulp.src(['bower.json', 'bower_components'])
        .pipe(cached('bower.json'))
        .pipe(run('bower install'));
});

gulp.task('build', ['less', 'bower-files']);

gulp.task('bower-files', ['bower'], function () {
    var jsFilter = gulpFilter(['**/*.js', '!**/*.min.js', '!**/src/**.']);
    var cssFilter = gulpFilter(['**/*.css']);
    var removeFilter = gulpFilter([
        '**/*',
         '!**/src/**',
        '!**/test/**',
        '!**/examples/**',
        '!**/grunt/**',
        '!**/package.json',
        '! * */*.md',
        '!**/*grunt.js',
        '!**/bower.json',
        '!**/*.gzip',
        '!**/*grunt.scss'
    ]);
    gulp.src('bower_components/**')
        .pipe(cached('bower_components'))
        .pipe(removeFilter)
        // TODO: add css filter too
        .pipe(jsFilter)
        .pipe(gulpif(onHeroku, ngAnnotate()))
        // TODO: add source maps
        .pipe(gulpif(onHeroku, uglify()))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(gulpif(onHeroku, minifyCSS())) // FIXME: minifyCss removes source map comment
        .pipe(cssFilter.restore())
        .pipe(gulp.dest('build/components'));
});

gulp.task('less', function () {
    var cssFilter = gulpFilter(['**/*.css']);
    gulp.src('WEB-INF/less/**/*.less')
        .pipe(gulp.dest('build/css'))
        .pipe(cached('less'))
        .pipe(less())
        .pipe(cssFilter)
        .pipe(gulpif(onHeroku, minifyCSS())) // FIXME: minifyCss removes source map comment
        .pipe(cssFilter.restore())
        .pipe(gulp.dest('build/css'));
});

gulp.task('clean', function (cb) {
   return del([
       'build',
       'bower_components'
       ], cb);
});
