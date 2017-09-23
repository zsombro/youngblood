var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var preprocess = require('gulp-preprocess');

gulp.task('lint', function () {
	return gulp.src('*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('build:dev', function () {
	return gulp.src('src/*.js')
		.pipe(preprocess({ context: { DEBUG: true }}))
		.pipe(concat('youngblood.js'))
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(gulp.dest('dist'))
		;
});

gulp.task('build:prod', function() {
	return gulp.src('src/*.js')
		.pipe(preprocess())
		.pipe(concat('youngblood.min.js'))
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(uglify({ mangle: false }))		
		.pipe(gulp.dest('dist'))
		;
});

gulp.task('watch', function () {
	gulp.watch('src/*.js', ['lint', 'scripts']);
});

gulp.task('build:all', ['lint', 'build:dev', 'build:prod']);
gulp.task('live', ['build:dev', 'watch']);