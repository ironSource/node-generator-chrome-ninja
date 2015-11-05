const gulp = require('gulp')
    , manifest = require('../app/manifest.json')
  , { mkdir, writeFile } = require('fs')
  , { version } = require('../package.json')
  , { resolve, join } = require('path')

gulp.task('manifest:dev', (done) => {
  gulp.watch('app/manifest.json', ['manifest:dev'])

  // Allow eval() for livereactload
  let policy = "script-src 'self' 'unsafe-eval'; object-src 'self'"
  build(done, { content_security_policy: policy })
})

gulp.task('manifest:prod', (done) => build(done))

/**
 * [build description]
 *
 * @param  {Function} done  [description]
 * @param  {[type]}   extra =             {} [description]
 * @return {[type]}         [description]
 */
function build(done, extra = {}) {
  let mani = { ...manifest, version, ...extra }
    , json = JSON.stringify(mani, null, ' ')
    , dist = resolve(__dirname, '..', 'dist')
    , file = join(dist, 'manifest.json')

  mkdir(dist, (err) => {
    if (err && err.code !== 'EEXIST') done(err)
    else writeFile(file, json, done)
  })
}
