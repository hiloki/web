var gulp = require('gulp');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

gulp.task('css', function () {
  gulp.src('stylus/app.styl')
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(csscomb())
    .pipe(gulp.dest('public/css/'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('js', function () {
  gulp.src('public/js/app.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/js/'));
});

