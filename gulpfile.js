const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourceMaps = require('gulp-sourcemaps');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const changed = require('gulp-changed');
const imageMin = require('gulp-imagemin');

function style(){
 return gulp.src('./src/sass/**/*.scss')
  .pipe(sourceMaps.init({loadMaps: true}))
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(autoPrefixer('last 2 versions'))
  .pipe(cleanCSS())
  .pipe(sourceMaps.write())
  .pipe(gulp.dest('./dist/css'))
  .pipe(browserSync.stream())
}

function javaScript(){
  return gulp.src('./src/js/**/*.js')
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
}

function imageMinFunction(){ 
  return gulp.src('./src/images/*')
    .pipe(changed('./dist/images/'))
    .pipe(imageMin([
      imageMin.gifsicle({interlaced: true}),
      imageMin.mozjpeg({quality: 75, progressive: true}),
      imageMin.optipng({optimizationLevel: 5}),
      imageMin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
       })
    ]))
    .pipe(gulp.dest('./dist/images'))
}

function watch(){
  browserSync.init({
    open: 'external',
    proxy: 'http://localhost/gulpy-2',
    port: 8080

  });
  gulp.watch('./src/sass/**/*.scss', style);
  gulp.watch('./src/images/*', imageMinFunction);
  gulp.watch('./**/*.php').on('change', browserSync.reload);
  gulp.watch('./src/js/**/*.js', javaScript).on('change', browserSync.reload);
  
}

exports.style = style;
exports.javaScript = javaScript;
exports.imageMinFunction = imageMinFunction;
exports.watch = watch;

var build = gulp.parallel(watch);
gulp.task('default', build);