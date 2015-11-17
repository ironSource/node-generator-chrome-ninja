var gulp = require('gulp')
  , gulpif = require('gulp-if')
  , babel = require('gulp-babel')
  , trash = require('trash')
  , pathExists = require('path-exists')

gulp.task('trash', (done) => {
  if (pathExists.sync('./generators')) trash(['./generators'], done)
  else setImmediate(done)
})

gulp.task('build', ['trash'], () => {
  let condition = (vinyl) => {
    let file = vinyl.relative
    return file.slice(-3) === '.js' && file.indexOf('templates') < 0
  }

  return gulp.src('src/**/*')
    .pipe(gulpif(condition, babel()))
    .pipe(gulp.dest('generators'))
})

gulp.task('default', ['build'])
