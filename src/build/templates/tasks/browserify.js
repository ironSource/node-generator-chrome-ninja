var gulp = require('gulp')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , envify = require('envify/custom')
  , inProduction = require('in-production/function')
  , config = require('./config')
  , through2 = require('through2')
  , concat = require('concat-stream')
  , imitate = require('vinyl-imitate')
  , parcelify = require('parcelify')
  , touchp = require('touchp')<% if (preprocessor === 'less') { %>
  , less = require('less-css-stream')
  , npmImport = new (require('less-plugin-npm-import'))()<% } %>

var { log, PluginError, colors } = require('gulp-util')
  , { resolve } = require('path')

const SRC = 'app/lib/*/index.js'
    , DEST = 'dist'

gulp.task('browserify', () => bundleAll())
gulp.task('browserify:watch', () => bundleAll({ watch: true }))

function bundleAll(opts = {}) {
  let src = gulp.src(SRC, { read: false, base: 'app' })
    , initial = gulp.dest(DEST)
    , endless = gulp.dest(DEST)
    , watch = opts.watch

  // Global stylesheet transforms
  <% if (preprocessor === 'less') { %>let appTransforms = [
    function (file) {
      // Parcelify doesn't parse transform options in a package.json
      // like browserify does, so add transform manually.
      return less(file, { plugins: [npmImport] })
    }
  ]<% } else { %>let appTransforms = []<% } %>

  return src.pipe(through2.obj(function(file, _, next) {
    let b = bundleEntry(file.path)
      , style = resolve(DEST, file.relative, '..', 'bundle.css')
      , appTransformDirs = [ resolve(file.path, '..') ]

    parcelify(b, { watch, bundles: { style }, appTransforms, appTransformDirs })
      .on('error', (err) => log(error('parcelify', err)))
      .once('done', () => touchp.sync(style))

    let bundler = watch ? watchify(b).on('update', () => {
      log('Bundling %s', colors.magenta(file.relative))

      let contents = bundler.bundle()
      let swallow = (err) => {
        log(colors.red(err.message))
        log(err.stack)
        contents.unpipe()
      }

      contents.once('error', swallow).pipe(concat(buffer => {
        endless.write(imitate(file, buffer))
      }))
    }) : b

    let initialContents = bundler.bundle()
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

function error(plugin, err, opts) {
  return new PluginError(plugin, err, opts)
}
