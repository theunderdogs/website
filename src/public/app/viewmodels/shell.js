define(function (require) {
    var router = require('plugins/router'), 
        app = require('durandal/app'), 
        $ = require('jquery');
        require('bootstrap');
        require('jqueryui');
        require('jqueryMigrate');
        require('jqueryui');
        require('bootstrapHoverDropdown');
        require('slimscroll');
        require('blockui');
        require('uniform');
        var p = require('appScript');

    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'page2', moduleId: 'viewmodels/page2', title: 'Page 2', nav: true }
            ]).buildNavigationModel();
            
            return router.activate();
        },
        attached: function(){
            //app.init();
            p.init();
        }
    };
});