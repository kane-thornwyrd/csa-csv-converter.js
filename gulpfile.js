const gulp = require('gulp-help')(require('gulp'));

const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');

const babelConf = require('./.babelrc.json');

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js','!node_modules/**'])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('babel', ['lint'], () =>
  gulp.src(['src/**','!node_modules/**'])
    .pipe(plumber())
    .pipe(babel(babelConf))
    .pipe(gulp.dest('lib'))
);

gulp.task('default', ['babel']);

gulp.task('watch', ['default'], () => {
  gulp.watch('src/**', ['default']);
});
