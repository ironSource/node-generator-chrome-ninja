var gulp = require('gulp')
  , zip = require('gulp-zip')

gulp.task('compress', () => {
  let { version } = require('../app/manifest.json')
    , { name } = require('../package.json')
  
  return gulp.src('dist/**/*')
    .pipe(zip(`${name}-${version}.zip`))
    .pipe(gulp.dest('package'))
})
