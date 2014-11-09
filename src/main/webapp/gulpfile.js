var gulp = require('gulp');
var bower = require('gulp-bower');
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

var onHeroku = Boolean(process.env.HEROKU_ENV);
var minifyCode = onHeroku || Boolean(process.env.MINIFY_CODE);
var mergeJS = onHeroku || Boolean(process.env.MERGE_JS);
var inlineJSandCSS = mergeJS && minifyCode;

gulp.task('default', ['build']);

gulp.task('bower', function () {
    return bower();
});

gulp.task('build', ['html', 'css', 'js', 'favicon']);

gulp.task('components', ['bower'], function () {
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

gulp.task('css', ['less', 'components'], function () {
    gulp.src('build/**/*.css')
        .pipe(cached('css'))
        .pipe(gulpif(minifyCode, minifyCSS()))
        .pipe(size({showFiles: true, title: 'CSS'}))
        .pipe(gulp.dest('build'))
});

gulp.task('less', function () {
    return gulp.src('WEB-INF/less/**/*.less')
        .pipe(cached('less'))
        .pipe(gulp.dest('build/css'))
        .pipe(less())
        .pipe(size({showFiles: true, title: 'LESS -> CSS'}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('html', ['js', 'css'], function () {
    return gulp.src('WEB-INF/index.html')
        .pipe(gulpif(inlineJSandCSS, inlinesource({
            rootpath: 'build'
        })))
        .pipe(gulpif(minifyCode, minifyHTML({empty: true})))
        .pipe(size({showFiles: true, title: 'HTML'}))
        .pipe(gulp.dest('build'));
});

gulp.task('template-cache', function () {
    return gulp.src(['WEB-INF/**/*/*.html', 'resources/**/*/*.html'])
        .pipe(gulpif(minifyCode, minifyHTML({empty: true})))
        .pipe(gulp.dest('build'))
        .pipe(templateCache('templates.js', {
            standalone: true
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('js', ['template-cache', 'widgets', 'components', 'movejs', 'annotate-js'].concat(mergeJS ? ['amd-merge'] : []), function () {
    return gulp.src(['build/**/*.js'])
        .pipe(cached('js'))
        ////.pipe(gulpif(true, uglify()))
        //.pipe(size({showFiles: true, title: 'JS'}))
        .pipe(gulp.dest('build'));
});

gulp.task('movejs', function () {
    return gulp.src('WEB-INF/js/**/*.js')
        .pipe(cached('movejs'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('annotate-js', ['template-cache', 'widgets', 'components', 'movejs'], function () {
    return gulp.src('build/**/*.js')
        .pipe(cached('annotate-js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('build'));
});

gulp.task('widgets', function () {
    return gulp.src(['resources/widgets/**'])
        .pipe(cached('widgets'))
        .pipe(gulp.dest('build/widgets'));
});

gulp.task('amd-merge', ['amd-optimize'], function () {
    gulp.src(['build/js/compiled.js', 'build/js/main.js'])
        .pipe(cached('amd-merge'))
        .pipe(concat('main.js'))
        .pipe(gulpif(minifyCode, uglify()))
        .pipe(gulp.dest('build/js'));
});

gulp.task('amd-optimize', ['components', 'widgets', 'movejs', 'template-cache', 'annotate-js'], function () {
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
        .pipe(gulpif(minifyCode, uglify()))
        .pipe(size({showFiles: true, title: 'amd-optimize'}))
        .pipe(gulp.dest('build'));
});

gulp.task('favicon', function () {
    return gulp.src('favicon.ico')
        .pipe(cached('favicon'))
        .pipe(gulp.dest('build'));
});

// Rerun the task when a file changes
gulp.task('watch', ['build'], function() {
    gulp.watch(['WEB-INF/**', 'resources/**', 'bower.json', 'favicon.ico', '!resources/config/**'], ['build']);
});

gulp.task('clean', function (cb) {
   return del([
       'build',
       'bower_components'
       ], cb);
});
