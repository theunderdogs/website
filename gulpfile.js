var gulp = require('gulp'),
	del = require('del'),
	config = require('./gulpConfig.js'),
	run = require('gulp-run'),
	argv = require('yargs').argv,
	runSequence = require('run-sequence'),
	requirejsOptimize = require('gulp-requirejs-optimize'),
	gulpFilter = require('gulp-filter'),
	ifElse = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	minifyHTML = require('gulp-minify-html'),
	nsSass = require('gulp-ruby-sass-ns'),
	browserSync = require('browser-sync').create(),
    server = require('gulp-develop-server'),
    promise = require('promise/lib/es6-extensions'),
	move = function(obj, options){
		var isMinify = function(){
			return options && options.minify;
		};

		var jsFilter = gulpFilter('**/*.js', {restore: true}),
		    cssFilter = gulpFilter('**/*.css', {restore: true}),
		    htmlFilter = gulpFilter('**/*.html', {restore: true}),
		    scssFilter = gulpFilter('**/*.scss', {restore: true});

		return gulp.src(obj.src)
				   .pipe(ifElse(isMinify(), jsFilter))
	        	   .pipe(ifElse(isMinify(), uglify()))
	        	   .pipe(ifElse(isMinify(), jsFilter.restore))

	        	   .pipe(ifElse(isMinify(), cssFilter))
	        	   .pipe(ifElse(isMinify(), minifyCss({compatibility: 'ie8'})))
	        	   .pipe(ifElse(isMinify(), cssFilter.restore))

	        	   .pipe(ifElse(isMinify(), htmlFilter))
	        	   .pipe(ifElse(isMinify(), minifyHTML({ empty: true, cdata: true, conditionals: true, spare: true, quotes: true, loose : true })))
	        	   .pipe(ifElse(isMinify(), htmlFilter.restore))

	        	   .pipe(scssFilter)
	        	   .pipe(nsSass({ style: 'compact' }))
	        	   .pipe(ifElse(isMinify(), minifyCss({compatibility: 'ie8'})))
	        	   .pipe(gulp.dest(obj.dest))   
	        	   .pipe(scssFilter.restore)

	               .pipe(gulp.dest(obj.dest));    
    };

/*
* This gulp task will only be used for debug and minify - NO CONCAT
* Example: gulp move --task=moveuiFiles.durandalViewmodels --f=minify
*/
gulp.task('move', function(){
	if(!argv.task) throw new Error('Arguments not found');

    if(argv.task.indexOf('.') == -1) throw new Error('. not found in property');

    if(!config.hasOwnProperty(argv.task.split('.')[0])) throw new Error(argv.task.split('.')[0] + ' Property not found');

    if(!config[argv.task.split('.')[0]].hasOwnProperty(argv.task.split('.')[1])) throw new Error(argv.task.split('.')[0] + ' Property not found');

	return move(config[argv.task.split('.')[0]][argv.task.split('.')[1]], { minify : (argv.f == 'minify' ? true : false) });
});

/*
* Example: gulp clean --t=deleteserverFiles
*/
gulp.task('clean', function(cb) {
    if(!argv.t) throw new Error('Arguments not found');

    if(!config.hasOwnProperty(argv.t)) throw new Error(argv.t + ' Property not found');

	return del(config[argv.t], { force : true});  //del returns a promise
});

/*
* Example: gulp build --f=minify|debug --t=ui|server|all
		   gulp build --f=singleui
*/
gulp.task('build', function(cb){
	if(!argv.f) throw new Error('Argument f not found');

    if(argv.f == 'minify' || argv.f == 'debug'){
        if(!argv.t) throw new Error('Argument t not found');

        if(argv.t == 'ui' || argv.t == 'all'){
            run('gulp clean --t=deleteuiFiles').exec('', function(){
                for(var property in config.moveuiFiles){
                    console.log('EXECUTING ' + property);
                    move(config.moveuiFiles[property], { minify : (argv.f == 'minify' ? true : false) });           
                }
            });
        }

        if(argv.t == 'server' || argv.t == 'all'){
            run('gulp clean --t=deleteserverFiles').exec('', function(){
                for(var property in config.moveserverFiles){
                    console.log('EXECUTING ' + property);
                    move(config.moveserverFiles[property], { minify : (argv.f == 'minify' ? true : false) });           
                }
            });
        }
	} else if(argv.f == 'singleui'){
	
		console.log('\nNOTE : THIS PROCESS WILL ONLY CONOLIDATE ONLY UI FILES THAT ARE LISTED IN THE CONFIGURATION. PLEASE MAKE SURE TO ALSO INCLUDE UI FILES THAT ARE NOT CONSOLIDATED WHILE DEPLOYING\n');

		return gulp.src(config.createSingle.src_main_module)
				.pipe(requirejsOptimize(config.createSingle.buildConfig)).on('error', function(er){ console.log(er);  })
				.pipe(gulp.dest(config.createSingle.dest));
		
	} else throw new Error('Arguments not supported');
});

/*
* produces debug build only
*/
gulp.task('watch', function(){
	browserSync.init(config.bsConfig);

    Object.keys(config.moveuiFiles).forEach(function(taskName) {
        // gulp.watch(config.paths[taskName].src, [taskName]);
        gulp.watch(config.moveuiFiles[taskName].src, function() {
            //'gulp clean && gulp build --f=debug --t=ui'
            run('gulp move --task=moveuiFiles.' + taskName).exec('', function(){
            	browserSync.reload();	
            });
        });
    });

    Object.keys(config.moveserverFiles).forEach(function(taskName) {
        // gulp.watch(config.paths[taskName].src, [taskName]);
        gulp.watch(config.moveserverFiles[taskName].src, function() {
            //'gulp clean && gulp build --f=debug --t=server'
            run('gulp move --task=moveserverFiles.' + taskName + ' && gulp server --t=restart').exec('', function(){
                browserSync.reload();   
            });
        });
    });
});

/*
* server start,restart
* gulp server --t=restart|start
*/
gulp.task('server', function(){
    if(!argv.t) throw new Error('Arguments not found');

    if(argv.t == 'start'){
        //server.listen({ path:  './build/private/server.js', execArgv : ['--debug'] });
        server.listen({ path:  config.serverjs, execArgv : ['--debug'] });
    }else if(argv.t == 'restart'){
        server.restart( function( error ) {
                if( ! error ) {
                    throw new Error('Error while restarting server');
                }
        });
    }
});

/*
* default task
*/
gulp.task('default', function(){
    var p1 = new Promise(function(resolve, reject){
        run('gulp clean --t=deleteserverFiles').exec('', function(err){
            if(err){
                reject();
            }else{
                resolve();
            }
        })        
    });

    var p2 = new Promise(function(resolve, reject){
        run('gulp clean --t=deleteuiFiles').exec('', function(err){
            if(err){
                reject();
            }else{
                resolve();
            }
        })        
    });

    var p3 = new Promise(function(resolve, reject){
        run('gulp build --f=debug --t=all').exec('', function(err){
            if(err){
                reject();
            }else{
                resolve();
            }
        })        
    });

    p1
    .then(function(){
        return p2;
    })
    .then(function(){
        return p3;
    })
    .then(function(){
        run('gulp server --t=start').exec();
        run('gulp watch').exec();
    })
});