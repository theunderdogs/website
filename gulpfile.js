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


var tasks = function(){

};

tasks.prototype = {
    buildViewmodels : function(config){
        console.log("buildViewmodels started", config);
        // glob patterns
        // css/*.css   include css files
        // css/**/*.css include all css from subdirectories too
        // !css/style.css  exclude style.css
        // *.+(js|css)  include js and css files

        if(gulp.src('src/public/app/viewmodels/*.js')
                //gulp.src(['src/app/viewmodels/*.js', '!src/app/viewmodels/*.min.js'])
                .pipe(plumber()) //plumber is initialized before JS is checked for errors by renaming and uglify modules
                //.pipe(rename({suffix:'.min'}))
                .pipe(gulpif(!config.debug, uglify({ mangle: false }).on('error', gutil.log)))
                .pipe(chmod(777))
                .pipe(gulp.dest('build/public/app/viewmodels'))){
            if(gulp.src('src/public/app/*.js')
                .pipe(plumber())
                //.pipe(rename({suffix:'.min'}))
                .pipe(gulpif(!config.debug, uglify({ mangle: false }).on('error', gutil.log)))
                .pipe(chmod(777))
                .pipe(gulp.dest('build/public/app'))){
                return Promise.resolve(true);
            }
        }
    },
    /**
    **move HTML files to build
    **/
    buildHtml : function(){
        console.log("buildHtml started");
        //move index.html file
        if(gulp.src('src/public/*.+(js|html)')
            .pipe(plumber())  //plumber is initialized
            .pipe(chmod(777))
            .pipe(gulp.dest('build/public'))){
        
            if(gulp.src('src/public/app/views/*.html')
                    .pipe(plumber())  //plumber is initialized
                    .pipe(chmod(777))
                    .pipe(gulp.dest('build/public/app/views'))){
                return Promise.resolve(true);
            }
        }
    },
    /**move images to build**/
    buildAssets : function() {
        console.log("buildAssets started");
        if(gulp.src('./src/public/app/assets/**/*.*', { base: './src/public/app/assets' })
        .pipe(plumber())  //plumber is initialized before compass compiles
        .pipe(chmod(777))
        .pipe(gulp.dest('./build/public/app/assets'))){
            return Promise.resolve(true);
        }
    },
    buildUIlib : function(){
        console.log("buildUIlib started");
        //copy libs
        if(gulp.src('./src/public/lib/**/*.*', {base : './src/public/lib'})
                .pipe(plumber())  //plumber is initialized before compass compiles
                .pipe(chmod(777))
                .pipe(gulp.dest('./build/public/lib')))
        {
            if(gulp.src('./bower_components/**/*.*', {base : './bower_components'})
                .pipe(plumber())  //plumber is initialized before compass compiles
                .pipe(chmod(777))
                .pipe(gulp.dest('./build/public/lib'))){
                return Promise.resolve(true);    
            }

        }
    },
    buildCss : function(){
        console.log("buildCss started");
        //compile css
        if(gulp.src('./src/public/app/scss/*.scss')
                .pipe(plumber())  //plumber is initialized before compass compiles
                .pipe(compass({
                    config_file: './config.rb',
                    css: './build/public/app/css',
                    sass: './src/public/app/scss',
                    require: ['susy']
                }))
                .pipe(chmod(777))
                .pipe(gulp.dest('./build/public/app/css'))){
            if(gulp.src(['./src/public/app/css/**'])
                .pipe(plumber())  //plumber is initialized before compass compiles
                .pipe(chmod(777))
                .pipe(gulp.dest('./build/public/app/css'))){
                return Promise.resolve(true);
            }
        }
    },
    
    cleanuiFolder : function(){
        console.log("cleanuiFolder started");
        if(del.sync(['build/public/**'])){
            return Promise.resolve(true);
        }
    },
    watchUI : function(config){
        console.log("watchUI started");
        var _this = this;
        
        browserSync.init({
            proxy: 'localhost:3000',
            port: 44085,
            open: true,
            notify: true,
            reloadDelay: 1000,
            reloadDebounce: 1000,
            browser: ["google chrome"]
            //server: {
            //    baseDir: "./build/public"
            //}
        });

        gulp.watch('./src/public/**/*.*', function(){
            //_this.buildui(config)
            _this.buildHtml()
            .then(function(result) { return _this.buildViewmodels(config)} )
            .then(function(result){
                browserSync.reload();
            });
             //runSequence('buildui', );
        });
    },
    cleanServerFolder : function(){
        console.log("cleanServerFolder started");
        if(del.sync(['build/private/**'])){
            return Promise.resolve(true);
        }
    },
    deployServerFiles : function(config){
        console.log("deployServerFiles started");

        //build controllers
        if(gulp.src('src/private/controllers/*.js')
            //gulp.src(['src/app/viewmodels/*.js', '!src/app/viewmodels/*.min.js'])
            .pipe(plumber()) //plumber is initialized before JS is checked for errors by renaming and uglify modules
            //.pipe(rename({suffix:'.min'}))
            .pipe(gulpif(!config.debug, uglify({ mangle: false }).on('error', gutil.log)))
            .pipe(chmod(777))
            .pipe(gulp.dest('build/private/controllers'))){

            //build models
            if(gulp.src('src/private/models/*.js')
            .pipe(plumber())
            //.pipe(rename({suffix:'.min'}))
            .pipe(gulpif(!config.debug, uglify({ mangle: false }).on('error', gutil.log)))
            .pipe(gulp.dest('build/private/models'))){

                //build server.js
                 if(gulp.src('src/private/server.js')
                .pipe(plumber())
                //.pipe(rename({suffix:'.min'}))
                .pipe(gulpif(!config.debug, uglify({ mangle: false }).on('error', gutil.log)))
                .pipe(gulp.dest('build/private'))){

                    //build node modules
                    if(gulp.src(['src/private/node_modules', 'src/private/package.json'])
                        .pipe(plumber())
                        .pipe(gulp.dest('build/private'))){
                        return Promise.resolve(true);
                    }        

                 }

            }
        }        
    },
    buildui : function(config){
        console.log("config", config);
        console.log("buildui started");
        var _this = this;
        return _this.cleanuiFolder()
        .then(function(result) { return _this.buildHtml()} )
        .then(function(result) { return _this.buildViewmodels(config)} )
        .then(function(result) { return _this.buildCss()} )
        .then(function(result) { return _this.buildUIlib()} )
        .then(function(result) { console.log(result); return _this.buildAssets()} );

        //ops.buildOnly = true;
        //runSequence('cleanui-folder', ['buildHtml', 'buildViewmodels', 'buildCss', 'buildUIlib', 'buildAssets'], cb);
    },
    watchServer : function(config){
        var _this = this;
        console.log("watchServer started");
        //watch the src folder for changes and compile it to build, also restart server
        gulp.watch('src/private/**/*.js', function(){
            _this.deployServerFiles(config)
            .then(function(result){
                _this.serverRestart();
            });
            //runSequence('deployServerFiles', 'server:restart');
        });
    },
    serverRestart : function(){
        console.log("serverRestart started");
        return new Promise(function (resolve, reject) {
            server.restart( function( error ) {
                if( ! error ) {
                    browserSync.reload();
                    resolve(true);
                }
                else reject(false);
            });
        });
    },
    serverStart : function(){
        console.log("serverStart started");
        server.listen({ path:  './build/private/server.js'});
    },
    defaultserver : function(config){
        console.log("defaultserver started");
        //if(argv.debug){
        //    ops.debug = true;
        //}
        //'cleanserver-folder'
       // runSequence('deployServerFiles', ['server:start','watchServer'], cb);

       var _this = this;
       return _this.deployServerFiles(config)
       .then(function(result){
            _this.serverStart();
            _this.watchServer(config);
       });
    }
};

var tasksObj = new tasks();

gulp.task("default", function(){
    var config = { debug : false };

    if(argv.debug){
        config.debug = true;
    }

    return tasksObj.buildui(config)
    .then(function(result){
        tasksObj.watchUI(config);
        return tasksObj.defaultserver(config);
    });

    //runSequence('buildui',['watch', 'defaultserver'], cb);
});

gulp.task("buildui", function(){
    var config = { debug : false };

    if(argv.debug){
        config.debug = true;
    }

    return tasksObj.buildui(config)

//     runSequence('buildui',['watch', 'defaultserver'], cb);
});

// gulp.task("defaultserver", function(){

// });