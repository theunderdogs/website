module.exports = {

	serverjs : './build/private/server.js',

	moveuiFiles : {
		durandalViews :	{
			src : './src/public/app/views/**/*',
			dest : './build/public/app/views'
		},
		lib : {
			src : './src/public/lib/**/*',
			dest : './build/public/lib'
		},
		bower : {
			src : './bower_components/**/*',
			dest : './build/public/lib'
		},
		index : {
			src : './src/public/*.+(js|html)',
			dest : './build/public'
		},
		durandalViewmodels : {
			src : './src/public/app/viewmodels/**/*',
			dest: './build/public/app/viewmodels'
		},
		main_js : {
			src : './src/public/app/*.js',
			dest: './build/public/app'
		},
		customWidgets : {
			src : './src/public/app/customWidgets/**/*',
			dest: './build/public/app/customWidgets'
		},
		widgets : {
			src : './src/public/app/widgets/**/*',
			dest: './build/public/app/widgets'
		},
		classes : {
			src : './src/public/app/classes/**/*',
			dest: './build/public/app/classes'
		},
		scss : {
			src : './src/public/app/scss/*',
			dest : './build/public/app/css'
		},
		css : {
			src : './src/public/app/css/**/*',
			dest : './build/public/app/css'
		},
		assets : {
			src : './src/public/app/assets/**/*',
			dest : './build/public/app/assets'
		},
		cdn : {
			src : './src/public/cdn/**/*',
			dest : './build/public/cdn'
		}
	},

	moveserverFiles : {
		controllers :	{
			src : './src/private/controllers/*.js',
			dest : './build/private/controllers'
		},
		models :	{
			src : './src/private/models/*.js',
			dest : './build/private/models'
		},
		serverjs : {
			src : './src/private/server.js',
			dest : './build/private'
		},
		packagejson : {
			src : './src/private/package.json',
			dest : './build/private'
		},
		routes : {
			src : './src/private/routes/**/*',
			dest : './build/private/routes'
		},
		logic : {
			src : './src/private/logic/**/*',
			dest : './build/private/logic'
		}
	},

	deleteuiFiles : ['./build/public/**', '!./build/public'],

	deleteserverFiles : ['./build/private/**', '!./build/private', '!./build/private/node_modules', '!./build/private/node_modules/**/*'],

	createSingle : {
    	src_main_module : './src/public/app/main.js', //main module
    	dest : './build/public/app',
    	buildConfig: {
					 	name : 'main', // id of main module
						//optimize: 'none',
						paths : {
						 	requireLib: '../lib/require/require',
						 	text: '../lib/require/text',
						 	durandal: '../lib/durandal/js',
							plugins: '../lib/durandal/js/plugins',				
							transitions: '../lib/durandal/js/transitions',	 
						 	knockout: '../../../bower_components/knockout/dist/knockout.debug',
						 	bootstrap: '../lib/bootstrap/js/bootstrap',
						 	jquery: '../../../bower_components/jquery/dist/jquery',
						 	'knockout.validation': '../lib/knockout.validation/knockout.validation',
						 	'jqueryMigrate': '../lib/jquery/jquery-migrate-1.2.1.min',
					        'jqueryui': '../lib/jquery-ui/jquery-ui-1.10.3.custom.min',
					        'bootstrapHoverDropdown': '../lib/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min',
					        'slimscroll': '../lib/jquery-slimscroll/jquery.slimscroll.min',
					        'blockui': '../lib/blockUI/jquery.blockui.min',
					        'cropper': '../lib/jcropper/cropper.min',
					        'uniform': '../lib/uniform/jquery.uniform.min',
					        'storage': '../app/classes/storageManager',
					        'promise': '../lib/pollyfills/es6-promise/es6-promise.min',
					        'services': '../app/classes/services'
						 },
						 include : [
						  	'requireLib',
						  	'text',
							'durandal/activator',
					        'durandal/app',
					        'durandal/binder',
					        'durandal/composition',
					        'durandal/events',
					        'durandal/system',
					        'durandal/viewEngine',
					        'durandal/viewLocator',
					        
					        'plugins/dialog',
					        'plugins/history',
					        'plugins/widget',
					        'plugins/router',
							
					        'transitions/entrance',

					        'knockout.validation',
						 	'jqueryMigrate',
					        'jqueryui',
					        'bootstrapHoverDropdown',
					        'slimscroll',
					        'blockui',
					        'cropper',
					        'uniform',
					        'storage',
					        'promise',
					        'services',

							'bootstrap',
							'jquery',
							'knockout',
						
							'text!views/admin/dashboard.html',
							'viewmodels/admin/dashboard'
						 ],
						 shim: {
					        'bootstrap': {
					            deps: ['jquery'],
					            exports: 'jQuery'
					       },
					       'jqueryui': {
					            deps: ['jquery'],
					            exports: 'jQuery'
					       },
					       'jqueryMigrate': {
					            deps: ['jquery'],
					            exports: 'jQuery'
					       },
					       'bootstrapHoverDropdown': {
					            deps: ['bootstrap']
					       },
					       'slimscroll': {
					            deps: ['jquery'],
					            exports: 'jQuery'
					       },
					       'blockui': {
					            deps: ['jquery'],
					            exports: 'jQuery'
					       },
					       'uniform': {
					            deps: ['jquery'],
					            exports: 'jQuery'
					       }
					    },
						preserveLicenseComments : false,
					    out: 'main.js' //name of the file to be exported
					 }
    },

    bsConfig : {
    	//proxy: 'localhost',
        proxy: 'localhost:3000',
        port: 44085,
        open: true,
        notify: true,
        reloadDelay: 1000,
        reloadDebounce: 1000,
        browser: ["chrome"]
    }
};