const { src, dest, watch, parallel } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const paths = {
  scss: "src/scss/**/*.scss",
  imagenes: "src/img/**/*",
};
function css() {
      return (
        src(paths.scss)
          .pipe(sourcemaps.init())
          .pipe(sass({ outputStyle: "expanded" }))
          .pipe( postcss([autoprefixer(), cssnano()]))
          .pipe(sourcemaps.write("."))
          .pipe(dest("build/css"))
      );
}

function imagenes() {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/img') )
}

function versionWebp(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"));
  done();
}
function versionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}")
    .pipe(avif(opciones))
    .pipe(dest("build/img"));
  done();
}

function dev(done) {
     watch(paths.scss, css);
     watch(paths.imagenes, imagenes);
     watch(paths.imagenes, versionWebp);
     watch(paths.imagenes, versionAvif);
     done();
}


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(
  css,
  imagenes,
  versionWebp,
  versionAvif,
  dev
);
