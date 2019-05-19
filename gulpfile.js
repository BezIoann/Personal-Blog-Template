const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
let uglify = require('gulp-uglify-es').default;
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

//let jsFiles = ['./src/js/owl.carousel.js', './src/js/main.js']


function styles() {
    return gulp.src('./src/sass/**/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            // includePaths: require('node-normalize-scss').with('other/path', 'another/path') 
            // - or - 
            includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe(sourcemaps.write({
            includeContent: false,
            sourceRoot: '.'
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))

        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(cleanCSS({
            compatibility: 'ie8',
            level: 2
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
}


function scripts() {
    return gulp.src('./src/js/**.js')
        //.pipe(concat('./src/js/main.js'))

        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

function html() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

function img() {
    return gulp.src('./src/img/**/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            })
        ]))
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.stream());
}

function fonts() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'))
        .pipe(browserSync.stream());
}

function staticImg() {
    return gulp.src('./src/static img/**/*.*')
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });

    gulp.watch('./src/fonts/**/*.*', fonts);
    gulp.watch('./src/img/**/*.*', img);
    gulp.watch('./src/static img/**/*.*', staticImg);
    gulp.watch('./src/sass/**/*.*', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch("./src/*.html", html);

}



function clean() {
    return del(['build/*']);
}
gulp.task('staticImg', staticImg);
gulp.task('fonts', fonts)
gulp.task('html', html);
gulp.task('img', img);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
    gulp.parallel(scripts, html, styles, fonts, img, staticImg)
));

gulp.task('dev', gulp.series('build',
    'watch'));