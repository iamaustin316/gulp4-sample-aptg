import gulp from 'gulp';
import del from 'del';
import autoprefixer from "autoprefixer";
import gulpLoadPlugins from 'gulp-load-plugins';
import cssnano from 'cssnano';
import pngquant from 'imagemin-pngquant';
import mozjpeg from 'imagemin-mozjpeg';
import minimist from 'minimist';
import browserSync from "browser-sync";
import htmlmin from "gulp-htmlmin";
const $ = gulpLoadPlugins();

/*****************************************************
 * 變數 block
 *****************************************************/
var envOptions = {
    string: "env",
    default: { env: "develop" }
}
var options = minimist(process.argv.slice(2), envOptions) // process.argv = [node, gulp.js, arg1, arg2, ...]
var envIsPro = options.env === "production" || options.env == "pro"

export function envNow(cb) {
    console.log(`env now is: ${options.env}, so envIsPro is ${envIsPro}`)
    console.log(options)
    cb()
}

export function copyHTML() {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'))
}

/*****************************************************
 * 清除暫存 block
 *****************************************************/
export function clean() {
    return del(['./dist'])
}

/*****************************************************
 * 複製檔案 block
 *****************************************************/
export function copy() {
    return gulp
        .src([
            "./src/**/**",
            "!src/js/**/**",
            "!src/css/**/**",
            "!src/**/*.html"
        ])
        .pipe(gulp.dest("./dist"))
}

/*****************************************************
 * HTML 處理 block
 *****************************************************/
export function buildPugHTML() {
    return gulp.src('./src/**/*.pug')
        .pipe(pug({}))
        .pipe(gulp.dest('./dist'))
}

export function html() {
    return gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
        .pipe($.if(!envIsPro, browserSync.stream()))
}

/*****************************************************
 * CSS 處理 block
 *****************************************************/
export function scss() {
    const plugins = [
        autoprefixer,
        cssnano
    ];
    return gulp
        .src(["./src/sass/**/*.scss"])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe(
            $.sass({
                outputStyle: "nested"
            }).on("error", $.sass.logError)
        )
        .pipe($.postcss(plugins))
        .pipe($.cleanCss({ compatibility: 'ie8' }))
        .pipe($.sourcemaps.write("."))
        .pipe(gulp.dest("./dist/css"))
        .pipe($.if(!envIsPro, browserSync.stream()))
}

/*****************************************************
 *  JS 處理 block
 *****************************************************/
export function vendorJS() {
    return gulp
        .src([
            './node_modules/jquery/dist/jquery.min.js',
            './src/js/lib/current-device.min.js',
            './src/js/lib/jquery.easing.min.js',
            './src/js/lib/TweenMax.min.js',
            './src/js/lib/imagesloaded.pkgd.min.js',
            './src/js/lib/jquery.smooth-scroll.js',
            './src/js/lib/jquery.waypoints.min.js'
        ])
        .pipe($.concat("all.js"))
        .pipe(gulp.dest("./dist/js"))
}

export function babelIndex() {
    return gulp
        .src("./src/js/app.js")
        .pipe($.plumber())
        .pipe(
            $.babel({
                presets: ["@babel/env"]
            })
        )
        .pipe($.concat("app.js"))
        .pipe(
            $.uglify({
                compress: {
                    drop_console: false
                }
            }))
        .pipe(gulp.dest("./dist/js"))
        .pipe($.if(!envIsPro, browserSync.stream()))
}

/*****************************************************
 *  圖片處理 block
 *****************************************************/
export function imageMin() {
    return gulp
        .src("./src/images/**/*.*")
        .pipe($.imagemin([
            pngquant({ quality: [0.7, 0.7] }),
            mozjpeg({ quality: 80 })
        ]))
        .pipe(gulp.dest("./dist/images"))
}

/*****************************************************
 *  拷貝影片與icon font
 *****************************************************/
export function copyVideo() {
    return gulp
    .src("./src/video/*")
    .pipe(gulp.dest("./dist/video"))
}

export function copyFonts() {
    return gulp
    .src("./src/fonts/*")
    .pipe(gulp.dest("./dist/fonts"))
}

/*****************************************************
 *  實時預覽 block
 *****************************************************/
export function browser() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            reloadDebounce: 2000
        }
    })
}

/*****************************************************
 *   監視檔案
 *****************************************************/
export function watch() {
    gulp.watch(["./src/**/*.html"], html)
    gulp.watch(["./src/sass/**/*.scss"],scss)
    gulp.watch("./src/js/**/index.js", babelIndex)
    console.log("watching file ~")
}

/*****************************************************
 *  指令 block
 *****************************************************/
exports.default = gulp.parallel(
    scss,
    html,
    browser,
    copyVideo,
    watch
)

exports.build = gulp.series(
    gulp.series(clean, copy),
    gulp.parallel(scss, html, imageMin, copyVideo)
)

// = gulp build --env production
exports.buildPro = gulp.series(
    cb => {
        envIsPro = true
        cb()
    },
    gulp.series(clean),
    gulp.parallel(scss, html, imageMin, copyVideo)
)

// gulp # 能邊寫網頁邊看畫面的改變
// gulp build # 編譯出未壓縮的檔案
// gulp build --env production # 編譯出壓縮後的檔案
// gulp buildPro #編譯出壓縮後的檔案
//Type: String
//Default: nested
//Values: nested, expanded, compact, compressed
//gulp --verify 偵測外掛黑名單指令