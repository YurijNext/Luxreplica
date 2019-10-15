var gulp         = require('gulp'),
    pug          = require('gulp-pug'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imgmin       = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache');

gulp.task('pug', function() {
    return gulp.src('app/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app/'))
        .pipe(browserSync.reload({stream: true}))
})

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('libs-css', function() {
    return gulp.src([
        'app/libs/reset/dist/reset.min.css'
    ])
    .pipe(cssnano())
    .pipe(concat('libs.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('js', function() {
    return gulp.src('app/scripts/main.js', 'app/libs/**/*.js')
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('libs-js', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/html5shiv/dist/html5shiv.min.js',
        'app/libs/slick/dist/slick.min.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imgmin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('clean-dist', async function() {
    return del.sync('dist');
});

gulp.task('clear-cache', function () {
    return cache.clearAll();
});

gulp.task('build-css', function() {
    return gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'))
});

gulp.task('build-fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('build-js', function() {
    return gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'))
});

gulp.task('build-html', function() {
    return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('build', gulp.parallel('build-css', 'build-fonts', 'build-js', 'build-html'));

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('html'));
    gulp.watch(['app/scripts/main.js', 'app/libs/**/*.js'], gulp.parallel('js'));
    gulp.watch('app/pug/**/*.pug', gulp.parallel('pug'));
});

gulp.task('default', gulp.parallel('pug','libs-css', 'sass', 'libs-js', 'browser-sync', 'watch'));
