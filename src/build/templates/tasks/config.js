var gulp = require('gulp')

var config = require('config-prompt')({
  exampleString: { type: 'string', required: true },
  exampleFlag:   { type: 'boolean', default: true }
})

// Show all config entries
gulp.task('config:print', done => config.print(done))

// Move the config file to trash
gulp.task('config:trash', done => config.trash(done))

// Prompt for missing config entries. Run this before any other task.
gulp.task('config:prompt', done => config.prompt(done))

// Allow other tasks to consume config
module.exports = config
