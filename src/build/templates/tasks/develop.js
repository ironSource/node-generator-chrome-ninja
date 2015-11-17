const gulp = require('gulp')
    , sequence = require('run-sequence')

gulp.task('develop', (done) => {
  sequence( 'config:prompt'
          , 'config:print'
          , 'clean'
        , [ 'browserify:watch', 'assets', 'manifest:dev' ]
        , [ 'compress', 'assets:watch' ]
          ,  done )
})
