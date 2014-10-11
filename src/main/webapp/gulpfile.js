var gulp = require('gulp');
var bower = require('gulp-bower');
var del = require('del');

gulp.task('default', ['bower']);

gulp.task('bower', function () {
    // bower({directory: './components', cwd: './' });
    bower('./components');
});

gulp.task('clean', function (cb) {
   return del([
       './components',
       ], cb);
});
