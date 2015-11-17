var gulp = require('gulp')
  , zip = require('gulp-zip')
  , pkg = require('../package.json')

gulp.task('compress', function() {
  var filename = pkg.name + '-' + pkg.version + '.zip'

  return gulp.src('dist/**/*')
    .pipe(zip(filename))
    .pipe(gulp.dest('package'))
})
