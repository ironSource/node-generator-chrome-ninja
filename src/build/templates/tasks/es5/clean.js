var gulp = require('gulp')
  , trash = require('trash')
  , pathExists = require('path-exists')

gulp.task('clean', function(done) {
  if (pathExists.sync('./dist')) trash(['./dist'], done)
  else setImmediate(done)
})
