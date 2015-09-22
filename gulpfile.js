var gulp = require("gulp"),
    //for minifying js
    uglify = require("gulp-uglify"),
    //renaming file , for instance min.js
    rename = require('gulp-rename'),
    //for compiling and minify scss files
    compass = require('gulp-compass'),
    //if compile errors, plumber won't stop the server
    plumber = require('gulp-plumber'),
    //delete files module
    del = require('del'),
    //run the tasks in sequence
    runSequence = require('run-sequence'),
    //reload browser after client code changes
    browserSync = require('browser-sync').create(),
    //reload = browserSync.reload,
    //this module can parse arguments
    argv = require('yargs').argv,
    //if else conditions in gulp
    gulpif = require('gulp-if'),
    //gulp-util logs errors
    gutil = require('gulp-util'),
    //set permissions on files and folders
    chmod = require('gulp-chmod'),
    //execute command line commands
    server = require('gulp-develop-server'),
    //promise
    promise = require('promise/lib/es6-extensions'),
    //gulp callback
    gcallback = require('gulp-callback'),
    notify = require('gulp-notify');


var freakTasks = function(){
    var self = this;

    self.getGulpPromise = function(obj){
        return new Promise(function(resolve, reject){
            gulp.src(obj.src, {base : obj.base})
                .pipe(plumber())  //plumber is initialized before compass compiles
                .pipe(chmod(777))
                .pipe(gulp.dest(obj.dest))
                .on('finish', function() {
                    resolve(obj.res);
                })
                .on('error',function(e){
                    reject(new Error(obj.err));
                });
        });
    };

    self.cleanDurandal = function(){
        return del(['build/public/**']);
    };

    self.buildUIlib = function(){
        var p1 = self.getGulpPromise({ src: './src/public/lib/**/*.*',
            base: './src/public/lib', 
            dest: './build/public/lib', 
            res: 'copying libs finished', 
            err: 'copying libs error'});

        var p2 = self.getGulpPromise({ src: './bower_components/**/*.*',
            base: './bower_components', 
            dest: './build/public/lib', 
            res: 'copying bower finished', 
            err: 'copying bower error'});

        return Promise.all([p1, p2]);
    };

    self.buildHtml = function(){
        var p1 = new Promise(function(resolve, reject){
            gulp.src('src/public/*.+(js|html)')
            .pipe(plumber())  //plumber is initialized
            .pipe(chmod(777))
            .pipe(gulp.dest('build/public'))
            .on('finish', function() {
                resolve("copying js/html finished");
            })
            .on('error',function(e){
                reject(new Error('copying js/html error'));
            });
        });

        var p2 = self.getGulpPromise({ src: './src/public/app/views/**/*.*',
            base: './src/public/app/views', 
            dest: './build/public/app/views', 
            res: 'copying views finished', 
            err: 'copying views error'});

        return Promise.all([p1, p2]);
    };

    self.buildViewmodels = function(config){
        // glob patterns
        // css/*.css   include css files
        // css/**/*.css include all css from subdirectories too
        // !css/style.css  exclude style.css
        // *.+(js|css)  include js and css files

        var p1 = self.getGulpPromise({ src: './src/public/app/viewmodels/**/*.*',
            base: './src/public/app/viewmodels', 
            dest: './build/public/app/viewmodels', 
            res: 'copying viewmodels finished', 
            err: 'copying viewmodels error'});

        var p2 = new Promise(function(resolve, reject){
            gulp.src('src/public/app/*.js')
                .pipe(plumber())
                //.pipe(rename({suffix:'.min'}))
                .pipe(gulpif(!config.debug, uglify({ mangle: false }).on('error', gutil.log)))
                .pipe(chmod(777))
                .pipe(gulp.dest('build/public/app'))
                .on('finish', function() {
                    resolve("copying js finished");
                })
                .on('error',function(e){
                    reject(new Error('copying js error'));
                });
        });

        var p3 = self.getGulpPromise({ src: 'src/public/app/customWidgets/**/*.*',
            base: './src/public/app/customWidgets', 
            dest: './build/public/app/customWidgets', 
            res: 'copying customWidgets finished', 
            err: 'copying customWidgets error'});

        var p4 = self.getGulpPromise({ src: 'src/public/app/classes/**/*.*',
            base: './src/public/app/classes', 
            dest: 'build/public/app/classes', 
            res: 'copying classes finished', 
            err: 'copying classes error'});

        return Promise.all([p1, p2, p3, p4]);
    };

    self.buildCss = function(){
        var p1 = new Promise(function(resolve, reject){
            gulp.src('./src/public/app/scss/*.scss')
                .pipe(plumber())  //plumber is initialized before compass compiles
                .pipe(compass({
                    config_file: './config.rb',
                    css: './build/public/app/css',
                    sass: './src/public/app/scss',
                    require: ['susy']
                }))
                .pipe(chmod(777))
                .pipe(gulp.dest('./build/public/app/css'))
                .on('finish', function() {
                    resolve("copying scss finished");
                })
                .on('error',function(e){
                    reject(new Error('copying scss error'));
                });
        });

        var p2 = new Promise(function(resolve, reject){
            gulp.src(['./src/public/app/css/**'])
                .pipe(plumber())  //plumber is initialized before compass compiles
                .pipe(chmod(777))
                .pipe(gulp.dest('./build/public/app/css'))
                .on('finish', function() {
                    resolve("copying css finished");
                })
                .on('error',function(e){
                    reject(new Error('copying css error'));
                });
        });

        //compile css
        return Promise.all([p1, p2]);
    };

    self.buildAssets = function() {
        return new Promise(function(resolve, reject){
            gulp.src('./src/public/app/assets/**/*.*', { base: './src/public/app/assets' })
            .pipe(plumber())  //plumber is initialized before compass compiles
            .pipe(chmod(777))
            .pipe(gulp.dest('./build/public/app/assets'))
            .on('finish', function() {
                resolve("copying assets finished");
            })
            .on('error',function(e){
                reject(new Error('copying assets error'));
            });
        });
    };

    self.watchUI = function(config){
        console.log("watchUI started");
        
        browserSync.init({
            proxy: 'localhost:3000',
            port: 44085,
            open: true,
            notify: true,
            reloadDelay: 1000,
            reloadDebounce: 1000//,
            //browser: ["chrome"]
            //server: {
            //    baseDir: "./build/public"
            //}
        });

        // gulp.watch('./src/public/**/*.*', function(){
        //     console.log('REBUILDING DURANDAL');
        //     Promise.all([self.buildHtml(), self.buildViewmodels(config), self.buildCss()])
        //     .then(function(r){
        //         console.log('DURANDAL BUILD SUCCESSFUL..watching..', r);
        //         browserSync.reload();
        //     })
        //     .catch(function(r) { 
        //         console.log('DURANDAL BUILD FAILED..', r);
        //      });
        // });

        gulp.watch('./src/public/app/views/**/*.*', function(){
            console.log('REBUILDING VIEWS');
            self.buildHtml()
            .then(function(r){
                console.log('VIEWS BUILD SUCCESSFUL..watching..', r);
                browserSync.reload();
            })
            .catch(function(r) { 
                console.log('VIEWS BUILD FAILED..', r);
             });
        });

        gulp.watch('./src/public/app/viewmodels/**/*.*', function(){
            console.log('REBUILDING VIEWS');
            self.buildViewmodels(config)
            .then(function(r){
                console.log('VIEWMODELS BUILD SUCCESSFUL..watching..', r);
                browserSync.reload();
            })
            .catch(function(r) { 
                console.log('VIEWMODELS BUILD FAILED..', r);
             });
        });

        gulp.watch('src/public/app/*.js', function(){
            console.log('REBUILDING VIEWS');
            self.buildViewmodels(config)
            .then(function(r){
                console.log('app/*.js BUILD SUCCESSFUL..watching..', r);
                browserSync.reload();
            })
            .catch(function(r) { 
                console.log('app/*.js BUILD FAILED..', r);
             });
        });

        gulp.watch('src/public/app/customWidgets/**/*.*', function(){
            console.log('REBUILDING VIEWS');
            self.buildViewmodels(config)
            .then(function(r){
                console.log('CUSTOMWIDGETS BUILD SUCCESSFUL..watching..', r);
                browserSync.reload();
            })
            .catch(function(r) { 
                console.log('CUSTOMWIDGETS BUILD FAILED..', r);
             });
        });


        gulp.watch('src/public/app/classes/**/*.*', function(){
            console.log('REBUILDING VIEWS');
            self.buildViewmodels(config)
            .then(function(r){
                console.log('CLASSES BUILD SUCCESSFUL..watching..', r);
                browserSync.reload();
            })
            .catch(function(r) { 
                console.log('CLASSES BUILD FAILED..', r);
             });
        });
    };

    self.deployServerFiles = function(config){
        
        var p1 = new Promise(function(resolve, reject){
            gulp.src('src/private/controllers/*.js')
            //gulp.src(['src/app/viewmodels/*.js', '!src/app/viewmodels/*.min.js'])
            .pipe(plumber()) //plumber is initialized before JS is checked for errors by renaming and uglify modules
            //.pipe(rename({suffix:'.min'}))
            .pipe(gulpif(!config.debug, uglify({ mangle: false })))
            .pipe(chmod(777))
            .pipe(gulp.dest('build/private/controllers'))
            .on('finish', function() {
                resolve("copying controllers finished");
            })
            .on('error',function(e){
                reject(new Error('copying controllers error'));
            });
        });

        var p2 = new Promise(function(resolve, reject){
            gulp.src('src/private/models/*.js')
            .pipe(plumber())
            //.pipe(rename({suffix:'.min'}))
            .pipe(gulpif(!config.debug, uglify({ mangle: false })))
            .pipe(gulp.dest('build/private/models'))
            .on('finish', function() {
                resolve("copying models finished");
            })
            .on('error',function(e){
                reject(new Error('copying models error'));
            });
        });

        var p3 = new Promise(function(resolve, reject){
            gulp.src('src/private/server.js')
            .pipe(plumber())
            //.pipe(rename({suffix:'.min'}))
            .pipe(gulpif(!config.debug, uglify({ mangle: false })))
            .pipe(gulp.dest('build/private'))
            .on('finish', function() {
                resolve("copying server finished");
            })
            .on('error',function(e){
                reject(new Error('copying server error'));
            });
        });

        var p3 = new Promise(function(resolve, reject){
            gulp.src('src/private/package.json')
            .pipe(plumber())
            .pipe(gulp.dest('build/private'))
            .on('finish', function() {
                resolve("copying package.json finished");
            })
            .on('error',function(e){
                reject(new Error('copying package.json error'));
            });
        });

        var p4 = new Promise(function(resolve, reject){
            gulp.src('./src/private/routes/**/*.*', { base: './src/private/routes' })
            .pipe(plumber())
            .pipe(gulp.dest('./build/private/routes'))
            .on('finish', function() {
                resolve("copying routes finished");
            })
            .on('error',function(e){
                reject(new Error('copying routes error'));
            });
        });

        var p5 = new Promise(function(resolve, reject){
            gulp.src('./src/private/logic/**/*.*', { base: './src/private/logic' })
            .pipe(plumber())
            .pipe(gulp.dest('./build/private/logic'))
            .on('finish', function() {
                resolve("copying logic finished");
            })
            .on('error',function(e){
                reject(new Error('copying logic error'));
            });
        });

        return Promise.all([p1, p2, p3, p4, p5]);      
    };

    self.serverStart = function(){
        console.log("serverStart started");
        server.listen({ path:  './build/private/server.js', execArgv : ['--debug'] });
    };

    self.serverRestart = function(){
        console.log("serverRestart started");
        return new Promise(function (resolve, reject) {
            server.restart( function( error ) {
                if( ! error ) {
                    resolve();
                }
                else reject();
            });
        });
    };

    self.watchServer = function(config){
        console.log("watchServer started");
        //watch the src folder for changes and compile it to build, also restart server
        gulp.watch('src/private/**/*.js', function(){
            self.deployServerFiles(config)
            .then(function(r){
                console.log('SERVER BUILD SUCCESSFUL', r);
                return self.serverRestart();
            })
            .then(function(r){
                browserSync.reload();
            })
            .catch(function(r){
                console.log('SERVER BUILD FAILED', r);
            });
            //runSequence('deployServerFiles', 'server:restart');
        });
    }; 
};

gulp.task('freak', function(){

    var config = { debug : false };

    if(argv.debug){
        config.debug = true;
    }

    var freaks = new freakTasks();

    freaks.cleanDurandal()
    .then(function(paths) {
        console.log(paths.join('\n'));
        return Promise.all([freaks.buildUIlib(config), freaks.buildHtml(), freaks.buildViewmodels(config), freaks.buildCss(), freaks.buildAssets()]);
    })
    .then(function(r) { console.log('DURANDAL BUILD SUCCESSFUL', r); })
    .catch(function(r) { console.log('DURANDAL BUILD FAILED..', r); });
});

gulp.task("freakdefault", function(){
    var config = { debug : false };

    if(argv.debug){
        config.debug = true;
    }

    var freaks = new freakTasks();

    return freaks.cleanDurandal()
    .then(function(paths) {
        //console.log(paths.join('\n'));
        return Promise.all([freaks.buildUIlib(config), freaks.buildHtml(), freaks.buildViewmodels(config), freaks.buildCss(), freaks.buildAssets()]);
    })
    .then(function(r) { 
        console.log('DURANDAL BUILD SUCCESSFUL', r); 
        return freaks.deployServerFiles(config);
    })
    .then(function(r){
        console.log('SERVER BUILD SUCCESSFUL', r); 
        freaks.serverStart();
        
        /*watching server*/
        freaks.watchServer(config);

        /*watching durandal files*/
        freaks.watchUI(config);
    })
    .catch(function(r) { 
        console.log('SOMETHING WENT WRONG!!!', r); 
    });

});

