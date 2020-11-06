const gulp                   = require('gulp');
const { watch, src, dest }   = require('gulp');
const babel                  = require('gulp-babel');
const uglify                 = require('gulp-uglify');
const rename                 = require('gulp-rename');
const prefix                 = require('gulp-autoprefixer');
const sass                   = require('gulp-sass');
const sourcemaps             = require('gulp-sourcemaps');
const concat                 = require('gulp-concat');
const htmlImport             = require('gulp-html-import');

sass.compiler = require('node-sass');

const paths = {
  dest:             [ './dist/' ],
  sass:             [ './style/*.sass' ],
  sassVendor:       [ './style/style.sass' ],
  css:              [ './style/' ],
  cssVendor:        [ './style/' ],
  js:               [ './js/*.js' ],
  jsVendor:         [ './js/' ],
  html:             [ './*.html'],
  htmlComponents:   [ './components/**/*.html' ]
};

function handleJSFiles() {
  return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dest+paths.jsVendor));
}

var sassOptions = {
  outputStyle: 'compressed' // compressed, expanded
};

function handleSASSFiles() {
  return gulp.src(paths.sassVendor)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(prefix())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest+paths.cssVendor));
}

function handleHTMLFiles() {
  return gulp.src(paths.html)
    .pipe(htmlImport('./components/'))
    .pipe(gulp.dest(paths.dest)); 
}

exports.default = function() {
  gulp.watch([ `${paths.html}`, `${paths.htmlComponents}` ], handleHTMLFiles);
  gulp.watch(paths.js,  { ignoreInitial: false }, handleJSFiles);
  gulp.watch(paths.sass,  { ignoreInitial: false }, handleSASSFiles);
};