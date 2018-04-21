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
var browsersync = require('browser-sync');
var path = require("path");

var config = {
    distPath: 'dist',
    filesCopy: ['src/*.html', 'src/*.css', 'src/models/*.babylon'],
    scripts: [
        // common.js - Will contain BabylonJS. We separate it out so babylon doesn't reprocess it everytime we change the rest of our code.
        {  
            dest: 'commons.js',
            typeScript: false,
            uglify: false,
            require: ['babylonjs'],
            external: [
                // Ignore these dependencies. We do not need a physics engine
                'cannon', 'oimo',
                'earcut'
            ]
        },
        // main.js - Contains our code.
        {
            dest: 'main.js',
            typeScript: true,
            uglify: true,
            src: ['src/main.ts'],
            external: ['babylonjs']
        }
    ]
};

var bundlerMap = [];
function scripts() {
    for (var i=0; i < config.scripts.length; i++) {
        buildScript(config.scripts[i]);
    }
}
function buildScript(scriptConfig) {
    var destFile = scriptConfig.dest;

    console.log('\n--- Starting bundle: ' + destFile + '---');
    console.log('Config: ', scriptConfig);

    var bundler = destFile in bundlerMap ? bundlerMap[destFile] : undefined;
    if (bundler === undefined) {
        // Create bundler for this dest file
        bundler = browserify({
            basedir: '.',
            debug: true,
            entries: scriptConfig.src,
            cache: {},
            packageCache: {}
        });
        if (scriptConfig.typeScript) {
            //console.log('   Enabling TypeScript');
            bundler.plugin(tsify);
        }
        bundler.plugin(watchify)
        bundler.on('update', scripts);

        if (scriptConfig.hasOwnProperty('require')) {
            //console.log('   Require: ', scriptConfig.require);
            bundler.require(scriptConfig.require);
        }
        if (scriptConfig.hasOwnProperty('external')) {
            //console.log('   External: ', scriptConfig.external);
            bundler.external(scriptConfig.external);
        }

        bundlerMap[destFile] = bundler;
    }

    var b = bundler.bundle()
        .on('log', gutil.log)
        .on('error', gutil.log)
        .pipe(source(destFile))
		.pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}));

    if (scriptConfig.uglify) {
        b = b.pipe(rename({extname: '.max' + path.extname(destFile)}))
            .pipe(gulp.dest(config.distPath))
            .pipe(rename(destFile))
            .pipe(uglify());
    };

    b = b.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.distPath));

    return b;
};

var copyFilesWatching = false;
function copyFiles() {
    if (copyFilesWatching === false) {
        copyFilesWatching = true;
        gulp.watch(config.filesCopy, {}, copyFiles);
    }
	return gulp.src(config.filesCopy)
		.pipe(gulp.dest(config.distPath));
}

var bs = null;
function browsersyncTask() {
    if (bs === null) {
        bs = browsersync.create();
        bs.init({
            server: {
                baseDir: './dist',
            },
            files: ['./dist/**']
        });
    }
}

gulp.task('copyFiles', copyFiles);
gulp.task('scripts', scripts);
gulp.task('browsersync', browsersyncTask);
gulp.task('default', ['copyFiles', 'scripts', 'browsersync']);