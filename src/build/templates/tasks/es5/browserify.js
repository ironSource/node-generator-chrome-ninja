var gulp = require('gulp')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , envify = require('envify/custom')
  , inProduction = require('in-production/function')
  , config = require('./config')
  , through2 = require('through2')
  , concat = require('concat-stream')
  , imitate = require('vinyl-imitate')
  , gutil = require('gulp-util')
  , assign = require('object-assign')

var log = gutil.log
  , colors = gutil.colors

var SRC = 'app/lib/*/index.js'
  , DEST = 'dist'

gulp.task('browserify', function() {
  return bundleAll()
})

gulp.task('browserify:watch', function() {
  return bundleAll(true)
})

function bundleAll(watch) {
  var src = gulp.src(SRC, { read: false, base: 'app' })
    , initial = gulp.dest(DEST)
    , endless = gulp.dest(DEST)
    , hotreloadPort = 4474

  return src.pipe(through2.obj(function(file, _, next) {
    var b = bundleEntry(file.path)

    if (watch) {
      b.plugin('livereactload', {
        client: 'livereactload-chrome',
        port: hotreloadPort++
      })

      b.plugin(watchify).on('update', function() {
        log('Bundling %s', colors.magenta(file.relative))

        var contents = b.bundle()

        function swallow(err) {
          log(colors.red(err.message))
          log(err.stack)
          contents.unpipe()
        }

        function write(buffer) {
          endless.write(imitate(file, buffer))
        }

        contents.once('error', swallow).pipe(concat(write))
      })
    }

    var initialContents = b.bundle()
    next(null, imitate(file, initialContents))
  })).pipe(initial)
}

function bundleEntry(file) {
  var opts = assign({}, watchify.args, { debug: !inProduction() })
    , b = browserify(file, opts).transform('babelify')

  // Substitute process.env.*, strip undefined variables
  var env = config.env({ NODE_ENV: process.env.NODE_ENV, _: 'purge' })
  b.transform(envify(env))

  // Add transform to modules that use process.env without envify. This is
  // safer than making envify a global transform.
  b.plugin('add-transforms', { 'react-bootstrap': ['envify'], 'uncontrollable': ['envify'] })

  if (inProduction()) b.transform({ global: true }, 'uglifyify')

  return b
}
