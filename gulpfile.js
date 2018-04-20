var gulp = require('gulp');
var browserify = require('browserify');
var rename = require("gulp-rename");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require('tsify');
var gutil = require("gulp-util");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

var config = {
    filesCopy: ['src/*.html', 'src/*.css'],
    tsEntries: ['src/main.ts']
};

var bundler = null;
function js() {
    console.log('\n--- Starting bundle ---');
    if (bundler === null) {
        bundler = browserify({
            basedir: '.',
            debug: true,
            entries: config.tsEntries,
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .plugin(watchify)
        .on('update', js);
    }

    return bundler
        .bundle()

        .on('log', gutil.log)
        .on('error', gutil.log)

        .pipe(source('bundle.js'))

		.pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
    
        .pipe(rename('bundle.max.js'))
		.pipe(gulp.dest('dist'))
        .pipe(rename('bundle.js'))
        .pipe(uglify())

		.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
};

var copyFilesWatching = false;
function copyFiles() {
    if (copyFilesWatching === false) {
        copyFilesWatching = true;
        gulp.watch(config.filesCopy, {}, copyFiles);
    }
	return gulp.src(config.filesCopy)
		.pipe(gulp.dest('dist'));
}

gulp.task('copyFiles', copyFiles);
gulp.task('default', ['copyFiles'], js);