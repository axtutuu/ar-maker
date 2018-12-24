'use strict';

import gulp from 'gulp';
import source from 'vinyl-source-stream';
import stylus from 'gulp-stylus';
import pleeease from 'gulp-pleeease';
import browserify from 'browserify';
import babelify from 'babelify';
import browserSync from 'browser-sync';
import readConfig from 'read-config';
import watch from 'gulp-watch';
import RevLogger from 'rev-logger';
import through2 from 'through2';


// const
const CONFIG = './config';
const HTDOCS = './public';
const PUBLIC = './public';

const BASE_PATH = '';
const DEST = `${HTDOCS}${BASE_PATH}`;

const revLogger = new RevLogger({
    'style.css': `${DEST}/css/style.css`,
    'script.js': `${DEST}/js/script.js`
});

gulp.task('stylus', () => {
    const config = readConfig(`${CONFIG}/pleeease.json`);
    return gulp.src(`./styl/style.styl`)
        .pipe(stylus())
        .pipe(pleeease(config))
        .pipe(gulp.dest(`${DEST}/css`));
});

gulp.task('css', gulp.series('stylus'));


// js
gulp.task('browserify', () => {
  return gulp.src(`./js/script.js`)
        .pipe(through2.obj(function(file, encode, callback) {
            browserify(file.path)
                .transform(babelify)
                .bundle((err, res)=> {
                  if (err) {
                    console.log(err.message);
                    console.log(err.stack);
                  }
                  file.contents = res;
                    callback(null, file);
                });
        }))
        .pipe(gulp.dest(`${DEST}/js`));
});

gulp.task('js', gulp.parallel('browserify'));

gulp.task('js', gulp.parallel('browserify'));


// serve
gulp.task('sync', () => {
    watch([`./styl/**/*.styl`], gulp.series('stylus'));
    watch([`./js/**/*.js[x]`, `./js/**/*.js`], gulp.series('browserify'));
});

gulp.task('serve', gulp.series('sync'));


// default
gulp.task('build', gulp.parallel('css', 'js'));
gulp.task('default', gulp.series('build', 'serve'));
