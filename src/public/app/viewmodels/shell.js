define(function(require) {
    var router = require('plugins/router'),
        app = require('durandal/app');
        //$ = require('jquery');
        require('bootstrap');
        require('jqueryui');
        require('jqueryMigrate');
        require('jqueryui');
        require('bootstrapHoverDropdown');
        require('slimscroll');
        require('blockui');
        require('uniform');
        var p = require('appScript'),
        uiconfig = require('classes/uiconfig'),
        navbar = require('customWidgets/nav/navviewmodel'),
        storage = require("storage");

    var shell = function(){
        this.init();
        this.uiconfig = uiconfig;
        navbar.router = router;
    };

    shell.prototype = {
        navbar: navbar,
        init: function(){
            this.configureRoutes();
        },
        configureRoutes: function(){
            var routes = [
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'page2', moduleId: 'viewmodels/page2', title: 'Page 2', nav: true },
                { route: 'admin', moduleId: 'viewmodels/admin/login', title: 'Admin', nav: true, loginUrl : '/app/views/admin/login.html' }
            ];

            if(storage.local("userConfig") && storage.local("userConfig").USER_ROLE){
                if(storage.local("userConfig").USER_ROLE == 'ADMIN'){
                    routes = [
                        { route: '', title:'Welcome', moduleId: 'viewmodels/admin/dashboard', nav: true }
                    ];
                }
            }

            router.map(routes).buildNavigationModel();
        },
        activate: function () {
            return router.activate({pushState : false});
        },
        compositionComplete: function(){
            //app.init();
            p.init();

            if(storage.local("userConfig") && storage.local("userConfig")._uiconfig){
                if(storage.local("userConfig")._uiconfig.showSidebar){
                    uiconfig.showSidebar(true);
                }else{
                    uiconfig.showSidebar(false);
                }

                if(storage.local("userConfig")._uiconfig.showNotificationIcon){
                    uiconfig.showNotificationIcon(true);
                }else{
                    uiconfig.showNotificationIcon(false);
                }

                if(storage.local("userConfig")._uiconfig.showTopMenu){
                    uiconfig.showTopMenu(true);
                }else{
                    uiconfig.showTopMenu(false);
                }

                if(storage.local("userConfig")._uiconfig.showLogout){
                    uiconfig.showLogout(true);
                }else{
                    uiconfig.showLogout(false);
                }
            }else{
                uiconfig.showSidebar(false);
                uiconfig.showTopMenu(true);
            }
        
            // if(storage.local("userConfig") && storage.local("userConfig").USER_ROLE){
            //     if(storage.local("userConfig").USER_ROLE == 'ADMIN'){
            //         uiconfig.showSidebar(true);
            //     }else{
            //         uiconfig.showSidebar(false);
            //     }
            // }else{
            //     uiconfig.showSidebar(false);
            // }

            console.log(storage.local("userConfig"));
        }
    }

    return new shell();
});