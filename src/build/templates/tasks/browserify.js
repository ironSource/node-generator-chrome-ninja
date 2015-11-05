const gulp = require('gulp')
    , browserify = require('browserify')
    , watchify = require('watchify')
    , envify = require('envify/custom')
    , inProduction = require('in-production/function')
    , config = require('./config')
    , through2 = require('through2')
    , concat = require('concat-stream')
    , imitate = require('vinyl-imitate')
  , { log, colors } = require('gulp-util')

const SRC = 'app/lib/*/index.js'
    , DEST = 'dist'

gulp.task('browserify', () => bundleAll())
gulp.task('browserify:watch', () => bundleAll(true))

function bundleAll(watch = false) {
  let src = gulp.src(SRC, { read: false, base: 'app' })
    , initial = gulp.dest(DEST)
    , endless = gulp.dest(DEST)
    , hotreloadPort = 4474

  return src.pipe(through2.obj(function(file, _, next) {
    let { relative, path } = file
    let b = bundleEntry(path)

    if (watch) {
      b.plugin('livereactload', {
        client: 'livereactload-chrome',
        port: hotreloadPort++
      })

      b.plugin(watchify).on('update', () => {
        log('Bundling %s', colors.magenta(relative))

        let contents = b.bundle()
        let swallow = (err) => {
          log(colors.red(err.message))
          log(err.stack)
          contents.unpipe()
        }

        contents.once('error', swallow).pipe(concat(buffer => {
          endless.write(imitate(file, buffer))
        }))
      })
    }

    let initialContents = b.bundle()
    next(null, imitate(file, initialContents))
  })).pipe(initial)
}

function bundleEntry(file) {
  let opts = { ...watchify.args, debug: !inProduction() }
    , b = browserify(file, opts).transform('babelify')

  // Substitute process.env.*, strip undefined variables
  let env = config.env({ NODE_ENV: process.env.NODE_ENV, _: 'purge' })
  b.transform(envify(env))

  // Add transform to modules that use process.env without envify. This is
  // safer than making envify a global transform.
  b.plugin('add-transforms', { 'react-bootstrap': ['envify'], 'uncontrollable': ['envify'] })

  if (inProduction()) b.transform({ global: true }, 'uglifyify')

  return b
}
