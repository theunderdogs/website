requirejs.config({
    paths: {
        'durandal':'../lib/durandal/js',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions' : '../lib/durandal/js/transitions',
        'storage': '../app/classes/storageManager',
        'services' : '../app/classes/services',

        //cant find cdn for this specific version
        'uniform': '../lib/uniform/jquery.uniform.min',
        'text': '../lib/require/text',
        //cant figure out the version
        'bootstrapHoverDropdown': '../lib/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min',
        'jqueryui': '../lib/jquery-ui/jquery-ui-1.10.3.custom.min',


        'promise': ['https://cdnjs.cloudflare.com/ajax/libs/es6-promise/2.2.0/es6-promise.min', '../lib/pollyfills/es6-promise/es6-promise.min'],
        'toBlob' : ['https://cdnjs.cloudflare.com/ajax/libs/javascript-canvas-to-blob/3.1.0/js/canvas-to-blob.min', '../lib/pollyfills/toBlob/canvas-to-blob.min'],
        'knockout': ['https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min', '../lib/knockout/dist/knockout'],
        'knockout.validation': ['https://cdnjs.cloudflare.com/ajax/libs/knockout-validation/2.0.3/knockout.validation.min', '../lib/knockout.validation/knockout.validation.min'],
        'bootstrap': ['https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min', '../lib/bootstrap/js/bootstrap.min'],
        'jquery': ['https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min', '../lib/jquery/dist/jquery.min'],
        'jqueryMigrate': ['https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.2.1/jquery-migrate.min', '../lib/jquery/jquery-migrate-1.2.1.min'],
        'slimscroll': ['https://cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.2/jquery.slimscroll.min', '../lib/jquery-slimscroll/jquery.slimscroll.min'],
        'blockui': ['https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.66.0-2013.10.09/jquery.blockUI.min', '../lib/blockUI/jquery.blockui.min'],
        'cropper': ['https://cdnjs.cloudflare.com/ajax/libs/cropper/1.0.0-rc.1/cropper.min', '../lib/jcropper/cropper.min'],
        'toastr' : ['https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/js/toastr.min', '../lib/bootstrap-toastr/toastr.min'],
        'lodash' : ['https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min', '../lib/lodash/lodash.min'],
        'datepicker' : ['https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/bootstrap-datepicker.min', '../lib/bootstrap-datepicker/js/bootstrap-datepicker.min'],
        'mixitup' : ['https://cdnjs.cloudflare.com/ajax/libs/mixitup/1.5.4/jquery.mixitup.min', '../lib/jquery-mixitup/jquery.mixitup.min'],
        'ckeditor' : ['https://cdnjs.cloudflare.com/ajax/libs/ckeditor/4.5.4/ckeditor', '../lib/ckeditor/ckeditor'], 
        'googlecalendar': ['https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.5.0/gcal', '../lib/fullCalendar/gcal'],
        'moment': ['https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min', '../lib/moment/moment.min'],
        'fullcalendar': ['http://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.5.0/fullcalendar.min', '../lib/fullCalendar/fullcalendar.min'],
        'gmapsjs' : ['https://cdnjs.cloudflare.com/ajax/libs/gmaps.js/0.4.11/gmaps.min', '../lib/gmaps/gmaps.min'],

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
       }
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
    
    //var regex = /^[a-zA-Z ]*$/;
    kovalidation.rules['alphabetsOnly'] = {
        validator: function (val, params) {
            var patt = /^[a-zA-Z]*$/;
            return patt.test(val);
        },
        message: 'Must be alphabets only'
    };

    kovalidation.rules['phone'] = {
        validator: function (val, params) {
            var patt = /^\d{10}$/;
            return patt.test(val);
        },
        message: 'Must be 10 digits only'
    };

    /*
        (/^
        (?=.*\d)                //should contain at least one digit
        (?=.*[a-z])             //should contain at least one lower case
        (?=.*[A-Z])             //should contain at least one upper case
        [a-zA-Z0-9]{8,}         //should contain at least 8 from the mentioned characters
        $/)
    */

    kovalidation.rules['password'] = {
        validator: function (val, params) {
            var patt = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            return patt.test(val);
        },
        message: 'Must be 10 digits only'
    };

    ko.validation.rules['arrayMustContainAtLeast'] = {
        validator: function (val, length) {
            if (val.length == length) {
                return true;
            }
            
            return false;
        },
        message: 'Require at least {0} items in list'
    };

    ko.validation.rules['arrayLessThanOrEqual'] = {
        validator: function (val, params) {
            if (val.length <= params.length) {
                return true;
            }
            
            return false;
        },
        message: 'Require at least {0} items in list'
    };

    ko.validation.registerExtenders();

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