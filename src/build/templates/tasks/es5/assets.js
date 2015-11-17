var gulp = require('gulp')
  , imagemin = require('gulp-imagemin')

var IMAGES = 'app/**/*.{jpg,png,jpeg,gif}'
  , REST = [ 'app/**/*.{ico,txt,html,webp,svg}'
           , 'app/**/*.css'
           , 'app/_locales/**/*.json'
           , 'app/styles/fonts/**/*.*' ]

gulp.task('assets:imagemin', function() {
  return gulp.src(IMAGES)
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('dist'))
})

gulp.task('assets:rest', function() {
  return gulp.src(REST, { base: 'app' }).pipe(gulp.dest('dist'))
})

gulp.task('assets:watch', function(done) {
  gulp.watch(IMAGES, ['assets:imagemin'])
  gulp.watch(REST, ['assets:rest'])

  done()
})

gulp.task('assets', ['assets:imagemin', 'assets:rest'])
