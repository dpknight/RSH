/// <binding AfterBuild='copy, min' Clean='clean' ProjectOpened='watch, min' />
var gulp = require('gulp'),
    del = require("del");
concat = require("gulp-concat"),
cssmin = require("gulp-cssmin"),
uglify = require("gulp-uglify"),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
browserSync = require('browser-sync').create();


var paths = {
    webroot: "./",
    bower: "./bower_components/"
};

paths.lib = paths.webroot + "lib/",
paths.js = paths.webroot + "src/js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "dist/css/**/*.css";
paths.minCss = paths.webroot + "dist/css/**/*.min.css";
paths.concatJsDest = paths.webroot + "dist/js/app.min.js";
paths.concatCssDest = paths.webroot + "dist/css/app.min.css";


gulp.task("copy", function () {
    var bower = {
    };

    for (var destinationDir in bower) {
        gulp.src(paths.bower + bower[destinationDir])
          .pipe(gulp.dest(paths.lib + destinationDir));
    }
});

gulp.task("clean:lib", function () {
    return del([paths.lib]);
});

gulp.task("clean:js", function () {
    return del([paths.concatJsDest]);
});

gulp.task("clean:css", function () {
    del(paths.concatCssDest);
});

gulp.task("clean", ["clean:js", "clean:css", "clean:lib"]);


gulp.task('min:js', function () {
    return gulp.src(['./src/js/jquery.min.js', "./src/js/**/*.js"])
        .pipe(concat('app.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

//gulp.task("min:js", function () {
//    //
//    return gulp.src(['./src/js/jquery.min.js', "./src/js/**/*.js"])

//   // gulp.src([paths.js, "!" + paths.minJs], { base: "." })
//        .pipe(concat(paths.concatJsDest))
//        .pipe(uglify())
//        .pipe(gulp.dest(paths.concatJsDest));
//});

gulp.task("min:css", function () {
    gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task('sass', function () {
    gulp.src('./src/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie 9'],
                cascade: false
            }))
      .pipe(gulp.dest(paths.webroot + 'dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//browsersync
// Static server
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            //baseDir: ["app", "dist"] //location of site
            baseDir: "./" //location of site
        }
    });
});

// dynamic site
// gulp.task('browserSync', function() {
//     browserSync.init({
//         proxy: "http://localhost:8888/atomic-site-boilerplate/app" // Server link
//     });
// });



//below will watch files once the browsersync task is completed
gulp.task('watch', ['browserSync'], function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./dist/css/app.css', ['min:css']);
    gulp.watch('./*.html', browserSync.reload);
    // gulp.watch('./src/js/*.js', ['min:js']);
    gulp.watch('./src/js/*.js', browserSync.reload);
    // Other watchers
});

//spin up browsersync server, then run watch tasks
gulp.task('default', ['sass', 'min', 'browserSync', 'watch']);


// gulp.task('sass:watch', function () {
//     gulp.watch('./sass/**/*.scss', ['sass']);
// });



// gulp.task('js:watch', function () {
//     gulp.watch(paths.js, ['min:js']);
// });

// gulp.task("watch", ["sass:watch", "js:watch"]);
