var gulp = require('gulp')
  , sequence = require('run-sequence')

gulp.task('build', function(done) {
  sequence( 'config:prompt'
          , 'config:print'
          , 'clean'
        , [ 'browserify', 'assets', 'manifest:prod' ]
          , 'compress'
          ,  done )
})
