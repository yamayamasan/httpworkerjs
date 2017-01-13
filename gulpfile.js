'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('default', ['build', 'minify']);

gulp.task('build', ['build:base', 'build:promise']);

gulp.task('minify', ['minify:base', 'minify:promise']);

gulp.task('build:base', () => {
  browserify({
    entries: ['./httpworker.js'],
    transform: ['babelify']
  })
  .bundle()
  .pipe(source('httpworker.js'))
  .pipe(gulp.dest('./dest'));
});

gulp.task('build:promise', () => {
  browserify({
    entries: ['./httpworker.promise.js'],
    transform: ['babelify']
  })
  .bundle()
  .pipe(source('httpworker.promise.js'))
  .pipe(gulp.dest('./dest'));
});

gulp.task('minify:base', () => {
  gulp.src('./dest/httpworker.js')
      .pipe(uglify())
      .pipe(rename('httpworker.min.js'))
      .pipe(gulp.dest('./dest'));
});

gulp.task('minify:promise', () => {
  gulp.src('./dest/httpworker.promise.js')
      .pipe(uglify())
      .pipe(rename('httpworker.promise.min.js'))
      .pipe(gulp.dest('./dest'));
});
