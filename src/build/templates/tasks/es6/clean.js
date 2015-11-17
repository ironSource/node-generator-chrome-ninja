<% if (modules === 'es6') { -%>
import gulp from 'gulp'
import trash from 'trash'
import pathExists from 'path-exists'
<% } else { -%>
const gulp = require('gulp')
    , trash = require('trash')
    , pathExists = require('path-exists')
<% } -%>

gulp.task('clean', (done) => {
  if (pathExists.sync('./dist')) trash(['./dist'], done)
  else setImmediate(done)
})
