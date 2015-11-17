<% if (modules === 'es6') { -%>
import gulp from 'gulp'
import zip from 'gulp-zip'
<% } else { -%>
const gulp = require('gulp')
    , zip = require('gulp-zip')
<% } -%>

gulp.task('compress', () => {
  let { name, version } = require('../package.json')

  return gulp.src('dist/**/*')
    .pipe(zip(`${name}-${version}.zip`))
    .pipe(gulp.dest('package'))
})
