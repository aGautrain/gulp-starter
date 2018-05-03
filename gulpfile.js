const gulp = require('gulp-help')(require('gulp')),
      uglify = require('gulp-uglify'),
      gzip = require('gulp-gzip'),
      connect = require('gulp-connect'),
      imagemin = require('gulp-imagemin'),
      sass = require('gulp-sass'),
      cssbeautify = require('gulp-cssbeautify'),
      jshint = require('gulp-jshint'),
      pump = require('pump'),
      del = require('del'),
      ftp = require('vinyl-ftp'),
      runSequence = require('run-sequence'),
      fs = require('fs'),
      size = require('gulp-size'),
	  debug = require('gulp-debug'),
      browserify = require('browserify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer');
	  
const config = require('./config'),
      logger = require('./logger');

gulp.task('stats', 'Summarize project with metrics', function(cb){
  pump([
        gulp.src('dist/**'),
		size({
			showFiles: true
		})
    ],
	cb
  );	
});

gulp.task('lint', 'Analyze JS code with JSHint', function (cb) {
  pump([
        gulp.src('src/assets/js/*.js'),
		jshint(),
		jshint.reporter('default')
    ],
	cb
  );
});

gulp.task('lib-js', 'Uglify scripts into dist/assets/js/', function (cb) {
  pump([
    gulp.src('./src/assets/js/lib/*.js'),
    gulp.dest('./dist/assets/js'),
    connect.reload()
  ],
  cb
);
});


gulp.task('js', 'Put all .js files into dist directory after bundling them, linting, and uglifying', function (cb) {
  pump([
    browserify({
      entries: './src/assets/js/main.js',
      debug: true
    }).bundle(),
    source('bundle.main.js'),
    gulp.dest('./dist/assets/js'),
    connect.reload()
  ],
  cb
);
});




gulp.task('imgs', 'Minify images into dist/assets/imgs/', function (cb) {
  pump([
        gulp.src('src/assets/imgs/*'),
		imagemin(),
		size({
			showFiles: true
		}),
        gulp.dest('dist/assets/imgs')
    ],
	cb
  );
});


gulp.task('app', 'Copy app folder from src/ to dist/', function (cb) {
  pump([
        gulp.src('src/app/*'),
		size({
			showFiles: true
		}),
        gulp.dest('dist/app'),
		connect.reload()
    ],
	cb
  );
});

gulp.task('css', 'Compile .scss files and beautify the resulting css', function(cb) {
  pump([
		// plain css
        gulp.src('src/assets/css/*.css'),
		size({
			showFiles: true
		}),
		cssbeautify(),
        gulp.dest('dist/assets/css'),
		
		// pre-compiled scss
		gulp.src('src/assets/css/*.scss'),
		size({
			showFiles: true
		}),
		sass(),
		cssbeautify(),
		gulp.dest('dist/assets/css')
    ],
	cb
  );
	
});


gulp.task('clean', 'Remove content of dist/', function() {
	del.sync(['dist']);
});

gulp.task('webserver', 'Launch webserver including livereload', ['default'], function(cb) {

  gulp.watch(['./src/app/*.html'], ['app']);
  gulp.watch(['./src/assets/js/*.js'], ['js']);
  gulp.watch(['./src/assets/css/*.scss'], ['scss']);
	connect.server({
		root: 'dist',
		livereload: true
	});
});

gulp.task('deploy', 'Deploy code onto FTP hosting provider given config.js', ['default'], function(cb) {
	const connection = ftp.create(config.ftpAuthentication); // loading conf file
	const globs = ["dist/app/**", "dist/assets/**", "dist/index.php"]; // folders to deploy
	
	logger.showAuthentications(config.ftpAuthentication);
	
	// writing a index.php redirecting to the app
	fs.writeFileSync('dist/index.php', '<?php\nheader("Location: app/index.html");\n?>');
	
	pump([
		gulp.src(globs, {base:'./dist/', buffer:false}),
		connection.newer(config.ftpPath),
		connection.dest(config.ftpPath),
	],
	cb);

});


gulp.task('default', function(done) {
    runSequence('clean', 'css', 'lib-js', 'js', 'app', 'imgs', 'stats', function() {
        done();
    });
});
