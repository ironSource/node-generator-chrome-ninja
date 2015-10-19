var gulp = require('gulp')
  , minilr = require('mini-lr')

var { log } = require('gulp-util')

gulp.task('livereload', (done) => {
  listen(35729, err => {
    if (err) return done(err)

    gulp.watch('dist/**/*', exports.reload)
    done()
  })
})

function listen(port, cb) {
  exports.server = minilr()
  exports.server.listen(port, function() {
    log('Livereload server listening on port %d', port)
    if (typeof cb === 'function') cb.apply(exports.server, arguments)
  })
}

// Expose reload() to other tasks
exports.reload = function() {
  if (!exports.server) {
    return log('No livereload server is listening, cannot reload.')
  }

  exports.server.changed({ body: { files: [ 'index.html' ] } })
}
