var gulp = require('gulp');
var hbsfy = require('hbsfy');
var $ = require('gulp-load-plugins')();

// Deploy
// --------------------------------------
gulp.task('css', function () {
  gulp.src('assets/styles/app.scss')
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe($.csscomb())
    .pipe(gulp.dest('public/css/'))
    .pipe($.cssmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css/'));
});
gulp.task('js', function () {
  gulp.src('assets/scripts/app.js')
    .pipe($.browserify({transform: [hbsfy]}))
    .pipe(gulp.dest('public/js/'))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('public/js/'));
});
gulp.task('build', ['css', 'js']);


