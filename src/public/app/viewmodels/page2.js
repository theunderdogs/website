define(['plugins/http', 'durandal/app', 'knockout', 'jquery', 'bootstrap'], function (http, app, ko, $) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    return {
        displayName: 'Page 2',
        activate: function () {
            //the router's activator calls this function and waits for it to complete before proceeding
            // if (this.images().length > 0) {
            //     return;
            // }

            // var that = this;
            // return http.jsonp('http://api.flickr.com/services/feeds/photos_public.gne', { tags: 'mount ranier', tagmode: 'any', format: 'json' }, 'jsoncallback').then(function(response) {
            //     that.images(response.items);
            // });
        }
        //canDeactivate: function () {
            //the router's activator calls this function to see if it can leave the screen
           // return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No'], false);
           //$("#basic").modal('show');

            // $("#basic").modal('show');

            // $( "nobutton" ).on( "click", function() {
            //   var defer = $.Deferred(),
            //     defer.done(function( value ) {
            //       return true;
            //     });
             
              
            // });
        //}

    };
});