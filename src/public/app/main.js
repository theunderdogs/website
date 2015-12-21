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
        
        'lodash' : '../lib/lodash/lodash',
        'datepicker' : '../lib/bootstrap-datepicker/js/bootstrap-datepicker',
        'mixitup' : '../lib/jquery-mixitup/jquery.mixitup.min',
        'toBlob' : '../lib/pollyfills/toBlob/canvas-to-blob.min',
        'ckeditor' : '../lib/ckeditor/ckeditor', //http://cdn.ckeditor.com/4.5.2/standard-all/ckeditor
        'googlecalendar': '../lib/fullCalendar/gcal',
        'moment': '../lib/moment/moment.min',
        'fullcalendar': '/lib/fullCalendar/fullcalendar.min',
        //recaptcha: 'https://www.google.com/recaptcha/api.js?render=explicit',
        //'recaptcha': 'http://www.google.com/recaptcha/api/js/recaptcha_ajax',
        'gmapsjs' : '../lib/gmaps/gmaps',

        async : '../lib/requirejs-plugins/src/async',   
        font: '../lib/requirejs-plugins/src/font',  
        goog: '../lib/requirejs-plugins/src/goog',  
        image: '../lib/requirejs-plugins/src/image',  
        json: '../lib/requirejs-plugins/src/json',  
        noext: '../lib/requirejs-plugins/src/noext',  
        mdown: '../lib/requirejs-plugins/src/mdown',  
        propertyParser : '../lib/requirejs-plugins/src/propertyParser',  
        markdownConverter : '../lib/requirejs-plugins/src/mdown',  

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
       },
       'mixitup': {
            deps: ['jquery'],
            exports: 'jQuery'
       },
       'toBlob': {
          'exports': 'toBlob'
       },
       'fullcalendar': {
            deps: ['jquery', 'moment'],
            exports: 'jQuery'
       },
       'googlecalendar': {
            deps: ['fullcalendar', 'jquery'],
            exports: 'jQuery'
       },
       'gmapsjs' : {
            deps: ['jquery']
            //'exports' : 'gmapsjs'
       }
       // ,
       // 'recaptcha': {
       //      exports: 'recaptcha'
       // }
    }
});

//use plugins as if they were at baseUrl
// define([
//         'image!awsum.jpg',
//         'json!data/foo.json',
//         'noext!js/bar.php',
//         'mdown!data/lorem_ipsum.md',
//         'async!http://maps.google.com/maps/api/js?sensor=false',
//         'goog!visualization,1,packages:[corechart,geochart]',
//         'goog!search,1',
//         'font!google,families:[Tangerine,Cantarell]'
//     ], function(awsum, foo, bar, loremIpsum){
//         //all dependencies are loaded (including gmaps and other google apis)
//     }
// );

define('main', ['durandal/system', 'durandal/app', 'durandal/viewLocator', 'knockout', 'knockout.validation','jquery', 'storage', 'promise', 'services', 'lodash', 'plugins/router', 'async!http://maps.google.com/maps/api/js?v=3&sensor=false'],  function (system, app, viewLocator, ko, kovalidation, $, storage, p, services, _, router) {
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

    ko.bindingHandlers.insertText = {
        init: function(element, valueAccessor) {
            var span = document.createElement("span"),
                firstChild = element.firstChild;

            element.insertBefore(span, firstChild);
            ko.applyBindingsToNode(span, { text: valueAccessor() });       
        }       
    };

    _.mixin({
      'findByValues': function(collection, property, values) {
        return _.filter(collection, function(item) {
          return _.contains(values, item[property]);
        });
      }
    });

    // define('gmaps', ['async!http://maps.google.com/maps/api/js?v=3&sensor=false'],
    //     function(){
            
    //         // return the gmaps namespace for brevity
    //         return window.google.maps;
    // });

    services.getTypes()
    .then(function(result){
        console.log(result);
        services.dataTypes(result.object);
        return app.start();
    })
    .then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});