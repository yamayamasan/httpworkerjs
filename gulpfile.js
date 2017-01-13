'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sequence = require('run-sequence');
const del = require('del');
const buffer = require('vinyl-buffer');
const replace = require('gulp-replace');

gulp.task('default', (cb) => {
  return sequence(
    'clean',
    'build',
    cb
  );
});

gulp.task('build', ['build:base', 'build:promise', 'build:worker', 'build:worker.promise']);

gulp.task('clean', (cb) => {
  return del(['./dist/*.js']);
});

gulp.task('build:worker', (cb) => {
  return compile('worker', false);
});

gulp.task('build:worker.promise', (cb) => {
  return compile('worker.promise', false);
});

gulp.task('build:base', (cb) => {
  return compile('httpworker');
});

gulp.task('build:promise', () => {
  return compile('httpworker.promise');
});

function compile(title, isMinify = true) {
  const base = `${title}.js`;
  const min  = `${title}.min.js`;
  const path = `./src/${base}`;
  const DIST_DIR = './dist';

  const task = browserify({
    entries: [path],
    transform: ['babelify']
  }).bundle()
    .pipe(source(base))
    .pipe(replace('%WORKER_FILE_NAME%', base.replace('http', '')))
    .pipe(gulp.dest(DIST_DIR));

  if (isMinify) {
    task.pipe(buffer())
        .pipe(uglify())
        .pipe(rename(min))
        .pipe(gulp.dest(DIST_DIR));
  }
  return task;
  /*
  return browserify({
    entries: [path],
    transform: ['babelify']
  })
  .bundle()
  .pipe(source(base))
  .pipe(gulp.dest(DIST_DIR))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(rename(min))
  .pipe(gulp.dest(DIST_DIR));
  */
}

