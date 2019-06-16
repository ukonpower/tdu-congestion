const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const connect = require('gulp-connect-php');
const del = require('del');
const minimist = require('minimist');

const options = minimist(process.argv.slice(2), {
    default: {
        P: false,
    }
});

gulp.task("webpack",function(){
    let conf = webpackConfig;
    conf.entry.main = './src/ts/main.ts';
    conf.output.filename = 'script.js';

    if(options.P){
        conf.mode = 'production';
    }

    return webpackStream(conf, webpack).on('error', function (e) {
            this.emit('end');
        })
        .pipe(gulp.dest("./public/js/"))
        .unpipe(browserSync.reload());
});

gulp.task("sass",function(c){
    return gulp.src("./src/scss/style.scss")
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest("./public/css/"))
        .pipe(browserSync.stream());
});

gulp.task('copy', function(c){
    gulp.src(['./src/html/**/*']).pipe(gulp.dest('./public/'));
    gulp.src(['./src/php/**/*']).pipe(gulp.dest('./public/php'));
    gulp.src(['./src/assets/**/*']).pipe(gulp.dest('./public/assets/'));
    browserSync.reload();
    c();
});

gulp.task('browser-sync',function(){
    connect.server({
        port: 8001,
        base: './public',
        bin: 'C:/Users/ukonpower/Documents/System/php-7.2.19-Win32-VC15-x64/php.exe',
        ini: 'C:/Users/ukonpower/Documents/System/php-7.2.19-Win32-VC15-x64/php.ini'
    }, function(){
        browserSync({
            proxy: 'localhost:8001'
        });
    });
});

gulp.task('reload',function(){
    browserSync.reload();
})

gulp.task('clean', function(c){
    del([
        './public/',
    ]);
    c();
});

gulp.task('watch',function(){
    gulp.watch('./src/ts/**/*', gulp.series('webpack'));
    gulp.watch('./src/scss/*.scss', gulp.task('sass'));
    gulp.watch(['./src/assets','./src/html','./src/php'], gulp.task('copy'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'webpack', 'sass'
    ),
    'copy',
    gulp.parallel('browser-sync', 'watch'),
))