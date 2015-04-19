var gulp = require('gulp');
var stylus = require('gulp-stylus');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('css', function () {
  gulp.src('stylus/app.styl')
    .pipe(stylus())
    .pipe(gulp.dest('public/css/'));
});


