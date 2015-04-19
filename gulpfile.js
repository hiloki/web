var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('css', function () {
  gulp.src('stylus/app.styl')
    .pipe($.stylus())
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
  gulp.src('public/js/app.js')
    .pipe($.browserify())
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('public/js/'));
});

