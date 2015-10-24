requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal':'../lib/durandal/js',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions' : '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/dist/knockout.debug',
        'knockout.validation': '../lib/knockout.validation/knockout.validation',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'jquery': '../lib/jquery/dist/jquery',
        'jqueryMigrate': '../lib/jquery/jquery-migrate-1.2.1.min',
        'jqueryui': '../lib/jquery-ui/jquery-ui-1.10.3.custom.min',
        'bootstrapHoverDropdown': '../lib/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min',
        'slimscroll': '../lib/jquery-slimscroll/jquery.slimscroll.min',
        'blockui': '../lib/blockUI/jquery.blockui.min',
        'cropper': '../lib/jcropper/cropper.min',
        'uniform': '../lib/uniform/jquery.uniform.min',
        'storage': '../app/classes/storageManager',
        'promise': '../lib/pollyfills/es6-promise/es6-promise.min',
        'services' : '../app/classes/services',
        /**
          Jade compiler and custom view engine next two lines
        **/
        //'jade': ['../lib/jade-0.35.0', '../lib/jade'],
        //'durandal/viewEngine': '../lib/durandal/js/jadeViewEngine',
        'appScript': 'app'
    },
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
    }
});

define('main', ['durandal/system', 'durandal/app', 'durandal/viewLocator', 'knockout', 'knockout.validation','jquery', 'storage', 'promise'],  function (system, app, viewLocator, ko, kovalidation, $, storage, p) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'The Underdogs Rescue';

    app.configurePlugins({
        router:true,
        dialog: true,
        widget: true
    });

    p.polyfill();

    ko.validation = kovalidation;
    ko.validation.init({
        insertMessages: false,
        errorsAsTitle: false,
        messagesOnModified: true
    });

    window.ko = ko;
    window.$ = $;
    window.storage = storage;
    window.promise = p;

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});