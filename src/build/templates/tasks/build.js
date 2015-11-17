const gulp = require('gulp')
    , sequence = require('run-sequence')

gulp.task('build', done => {
  sequence( 'config:prompt'
          , 'config:print'
          , 'clean'
        , [ 'browserify', 'assets', 'manifest:prod' ]
          , 'compress'
          ,  done )
})
