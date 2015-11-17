var gulp = require('gulp')
  , sequence = require('run-sequence')

gulp.task('develop', function(done) {
  sequence( 'config:prompt'
          , 'config:print'
          , 'clean'
        , [ 'browserify:watch', 'assets', 'manifest:dev' ]
        , [ 'compress', 'assets:watch' ]
          ,  done )
})
