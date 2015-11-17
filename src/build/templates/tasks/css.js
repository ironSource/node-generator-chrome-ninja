const gulp = require('gulp')
    , cssnext = require('gulp-cssnext')

const ENTRIES = 'app/lib/*/index.css'
const SOURCES = 'app/lib/**/*.css'
const OPTIONS = {
  browsers: 'last 3 Chrome versions',
  plugins: [ require('postcss-nested') ]
}

gulp.task('css:dev', () => {
  return gulp.src(ENTRIES, { base: 'app' })
    .pipe(cssnext({ ...OPTIONS, sourcemap: true }))
    .pipe(gulp.dest('dist'))
});

gulp.task('css:prod', () => {
  return gulp.src(ENTRIES, { base: 'app' })
    .pipe(cssnext({ ...OPTIONS, compress: true }))
    .pipe(gulp.dest('dist'))
})

gulp.task('css:watch', (done) => {
  gulp.watch(SOURCES, ['css:dev'])
  done()
})
