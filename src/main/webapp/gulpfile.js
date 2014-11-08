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
var minifyHTML = require('gulp-minify-html');
var size = require('gulp-size');
var templateCache = require('gulp-angular-templatecache');
var amdOptimize = require("amd-optimize");
var concat = require("gulp-concat");
var footer = require("gulp-footer");

var onHeroku = !!process.env.HEROKU_ENV;

gulp.task('default', ['build']);

gulp.task('bower', function () {
    return gulp.src('./')
        .pipe(cached('bower.json'))
        .pipe(run('bower install'));
});

gulp.task('build', ['index.html', 'template-cache', 'less', 'components', 'js', 'amd-optimize', 'favicon']);

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
    return gulp.src('WEB-INF/less/**/*.less')
        .pipe(cached('less'))
        .pipe(gulp.dest('build/css'))
        .pipe(less())
        .pipe(cssFilter)
        .pipe(gulpif(onHeroku, minifyCSS()))
        .pipe(cssFilter.restore())
        .pipe(size({showFiles: true, title: 'CSS'}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('index.html', function () {
    return gulp.src('WEB-INF/index.html')
        .pipe(cached('html'))
        .pipe(minifyHTML({empty: true}))
        .pipe(size({showFiles: true, title: 'HTML'}))
        .pipe(gulp.dest('build'));
});

gulp.task('template-cache', function () {
    return gulp.src(['WEB-INF/**/*/*.html', 'resources/**/*/*.html'])
        .pipe(cached('template-cache'))
        .pipe(gulp.dest('build'))
        .pipe(templateCache('templates.js', {
            standalone: true
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('js', ['template-cache', 'widgets'], function () {
    return gulp.src(['WEB-INF/**/*.js'])
        .pipe(cached('js'))
        .pipe(gulpif(true, ngAnnotate()))
        .pipe(gulpif(onHeroku, uglify()))
        .pipe(size({showFiles: true, title: 'JS'}))
        .pipe(gulp.dest('build'));
});

gulp.task('widgets', function () {
    return gulp.src(['resources/widgets/**'])
        .pipe(cached('widgets'))
        .pipe(gulp.dest('build/widgets'));
});

gulp.task('amd-optimize', ['js', 'components', 'widgets'], function () {
    return gulp.src(['build/**/*.js'], {
            base: 'build'
        })
        .pipe(cached('amd-optimize'))
        .pipe(size({showFiles: true, title: 'amd-optimize'}))
        .pipe(amdOptimize('js/app', {
            // alias libraries paths.  Must set 'angular'
            paths: {
                'angular': 'components/angular/angular',
                'template-cached-pages': 'js/templates',
                'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router',
                'angular-oclazyload': 'components/oclazyload/dist/ocLazyLoad',
                'angular-foundation': 'components/angular-foundation/mm-foundation-tpls'
            },
            // Add angular modules that does not support AMD out of the box, put it in a shim
            shim: {
                'angular': {
                    exports: 'angular'
                },
                'template-cached-pages': ['angular'],
                'angular-ui-router': ['angular'],
                'angular-oclazyload': ['angular'],
                'angular-foundation': ['angular']
            }
        }))
        .pipe(concat('js/main.js'))
        .pipe(footer("require(['js/app']);"))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(size({showFiles: true, title: 'amd-optimize'}))
        .pipe(gulp.dest('build'));
});

gulp.task('favicon', function () {
    gulp.src('favicon.ico')
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function (cb) {
   return del([
       'build',
       'bower_components'
       ], cb);
});
