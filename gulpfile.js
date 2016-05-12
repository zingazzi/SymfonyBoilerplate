var gulp = require('gulp');
var concat = require('gulp-concat');                    // concat css / js
var uglify = require('gulp-uglify');                    // minify js
var cleanCSS = require('gulp-clean-css');               // minify and clean css
var sourcemaps = require('gulp-sourcemaps');            // sourcemap
var imageop = require('gulp-image-optimization');       // img optimization
var rev = require('gulp-rev');                          // versioning
var revDel = require('rev-del');                        // Cancel old rev
var sass = require('gulp-sass');                        // sass
var autoprefixer = require('gulp-autoprefixer');        // Autoprefixer
var runSequence = require('run-sequence');              // Run sequence

var filesToMove = [
        './bower_components/mdi/fonts/*',
        './bower_components/fontawesome/fonts/*'
    ];

// MOVE FONTS
gulp.task('move', function(){
  gulp.src(filesToMove)
  .pipe(gulp.dest('web/fonts/'));
});

// OPTIMIZE IMAGE
gulp.task('images', function(cb) {
    gulp.src(['resources/assets/img/*.png','resources/assets/img/*.jpg','resources/assets/img/*.gif','resources/assets/img/*.jpeg']).pipe(imageop({
        optimizationLevel: 8,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('web/img')).on('end', cb).on('error', cb);
});

// SASS
gulp.task('sass', function () {
  return gulp.src('resources/assets/sass/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('resources/assets/css'));
});

// FE
gulp.task('styles', function() {
    return gulp.src([
      './bower_components/mdi/css/materialdesignicons.css',                      // MDI
      './bower_components/owl.carousel/dist/assets/owl.carousel.css',            // OWL CAROUSEL
      './bower_components/owl.carousel/dist/assets/owl.theme.default.min.css',   // OWL CAROUSEL
      './bower_components/animate.css/animate.css',                              // ANIMATE
      './bower_components/fancybox/source/jquery.fancybox.css',                  // FANCYBOX 
      './bower_components/slicknav/dist/slicknav.css',                           // SLICKNAV 
      './resources/assets/css/app.css'
   ])                       
    .pipe(concat('app.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('resources/build/css/'));
});

gulp.task('scripts', function() {
    return gulp.src([
      'bower_components/jquery/dist/jquery.js',                // JQUERY
      // 'bower_components/jquery-ui/jquery-ui.js',            // JQUERY - UI - ALL
      'bower_components/slicknav/dist/jquery.slicknav.js',     // SLICKNAV
      'bower_components/fancybox/source/jquery.fancybox.js',   // FANCYBOX
      'bower_components/fancybox/source/jquery.fancybox.js',   // FANCYBOX
      'resources/assets/js/app.js'
   ])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('resources/build/js/'));
});

gulp.task('version', function () {
    return gulp.src(['resources/build/css/*.css', 'resources/build/js/*.js'])
        .pipe(rev())
        .pipe(gulp.dest('web/build'))  // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(revDel({ dest: 'web/build' }))      
        .pipe(gulp.dest('web/build')); // write manifest to build dir
});

// BE
gulp.task('styles_be', function() {
    return gulp.src([
      'bower_components/mdi/css/materialdesignicons.css',                                          // MDI 
      'bower_components/fontawesome/css/font-awesome.css',                                         // FONT AWERSOME
      'bower_components/summernote/dist/summernote.css',                                           // SUMMERNOTE
      'bower_components/bootstrap/dist/css/bootstrap.css',                                         // BOOTSTRAP
      'bower_components/bootstrap-material-design/dist/css/bootstrap-material-design.css',         // BOOTSTRAP MD
      'bower_components/bootstrap-material-design/dist/css/ripples.css',                           // BOOTSTRAP MD RIPPLESS
      'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css', // TIMEPICKER
      'bower_components/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css',           // INLINE EDIT                                              // SLICKNAV 
      'resources/assets/css/admin.css'
   ])                       
    .pipe(concat('admin.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('web/css/'));
});

gulp.task('scripts_be', function() {
    return gulp.src([
      'bower_components/jquery/dist/jquery.js',                                                 // JQUERY
      'bower_components/jquery-ui/jquery-ui.js',                                                // JQUERY - UI - ALL
      'bower_components/moment/min/moment-with-locales.js',                                     // MOMENT + LOCALES
      'bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',  // DATETIMEPICKER
      'bower_components/Chart.js/dist/Chart.js',                                                // CHART
      'bower_components/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.js',          // INLINE EDIT
      'bower_components/summernote/dist/summernote.js',                                         // INLINE EDIT
      'resources/assets/js/admin.js'
   ])
    .pipe(concat('admin.js'))
    .pipe(uglify())
    .pipe(gulp.dest('web/js/'));
});

// WATCHER
gulp.task('watch', function () {
  gulp.watch('resources/assets/js/app.js', ['sass_watcher']);
  gulp.watch('resources/assets/sass/**/*.scss', ['sass_watcher']);
});

// COMMANDS
gulp.task('default', ['build']);

gulp.task('build', function() {
  runSequence('move', 'images', 'sass', ['styles', 'scripts', 'styles_be', 'scripts_be'], 'version');
});

gulp.task('build_fe', function() {
  runSequence('sass', 'styles',  'scripts', 'version');
});

gulp.task('build_be', function() {
  runSequence(['styles_be', 'scripts_be']);
});

gulp.task('sass_watcher', function() {
  runSequence('sass', ['styles', 'scripts'], 'version');
});
