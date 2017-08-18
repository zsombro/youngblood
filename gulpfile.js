var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('lint', function () {
	return gulp.src('*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('scripts', function () {
	return gulp.src('src/*.js')
		.pipe(concat('youngblood.js'))
		.pipe(gulp.dest('dist'))
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(gulp.dest('dist'))
		.pipe(rename('youngblood.min.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch('src/*.js', ['lint', 'scripts']);
});

gulp.task('default', ['lint', 'scripts', 'watch']);