var gulp = require('gulp')
  , sequence = require('run-sequence')

gulp.task('develop', done => {
  sequence( 'config:prompt'
          , 'config:print'
          , 'clean'
        , [ 'browserify:watch', 'assets', 'css:dev', 'manifest:dev' ]
        , [ 'compress', 'assets:watch', 'css:watch' ]
          ,  done )
})
