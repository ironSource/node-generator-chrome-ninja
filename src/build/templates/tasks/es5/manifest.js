var gulp = require('gulp')
  , assign = require('object-assign')
  , fs = require('fs')
  , version = require('../package.json').version
  , path = require('path')

gulp.task('manifest:dev', function(done) {
  gulp.watch('app/manifest.json', ['manifest:dev'])

  // Allow eval() for livereactload
  var policy = "script-src 'self' 'unsafe-eval'; object-src 'self'"
  build(done, { content_security_policy: policy })
})

gulp.task('manifest:prod', function(done) {
  build(done)
})

function build(done, extra) {
  delete require.cache[require.resolve('../app/manifest.json')]
  var manifests= require('../app/manifest.json')
  var mani = assign({}, manifest, { version: version }, extra)
    , json = JSON.stringify(mani, null, ' ')
    , dist = path.resolve(__dirname, '..', 'dist')
    , file = path.join(dist, 'manifest.json')

  fs.mkdir(dist, function(err) {
    if (err && err.code !== 'EEXIST') done(err)
    else fs.writeFile(file, json, done)
  })
}
