const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');

const paths = {
    src: process.cwd() + '/src/**/*.*',
    html: process.cwd() + '/src/templates/pages/*.pug',
    css: process.cwd() + '/src/styles/main.sass',
    images: process.cwd() + '/src/images/*.*',
    dist: process.cwd() + '/dist/'
};


gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(pug({
            pretty: false
        }))
        .pipe(gulp.dest(paths.dist))
        //.pipe(browserSync.stream());
});

gulp.task('css', function() {
    gulp.src(paths.css)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.dist + 'styles/'))
        .pipe(browserSync.stream());
});

gulp.task('images', function() {
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist + 'images/'));
});

gulp.task('clean', function() {
    del([paths.dist + '*']);
});

gulp.task('build', ['html', 'css']);


gulp.task('serve', ['html', 'css'], function() {

    browserSync.init({
        server: "dist/"
    });

    gulp.watch("src/templates/**/*.pug", ['html']);
    gulp.watch("src/styles/**/*.*", ['css']);
    gulp.watch("./dist/**/*.*").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);