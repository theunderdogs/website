define(function(require) {
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
        navbar = require('customWidgets/nav/navviewmodel');

    var shell = function(){
        router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'page2', moduleId: 'viewmodels/page2', title: 'Page 2', nav: true },
                { route: 'admin', moduleId: 'viewmodels/login', title: 'Admin', nav: true }
            ]).buildNavigationModel();

        navbar.router = router;
    };

    shell.prototype = {
        navbar: navbar,
        activate: function () {
            return router.activate();
        },
        compositionComplete: function(){
            //app.init();
            p.init();
        }
    }

    return new shell();
});