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
        navbarViewModel = require('customWidgets/nav/navviewmodel'),
        services = require('services');
        //storage = require("storage");

    var shell = function(){
        this.init = function(){
            this.configureRoutes();
        };

        this.configureRoutes = function(){
            var routes = [{ route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                   { route: 'adoptablePets', title:'Adoptable Pets', moduleId: 'viewmodels/adoptablePets', nav: true },
                   { route: 'donate', title:'Donate', moduleId: 'viewmodels/donate', nav: true },
                   { route: 'volunteer', title:'How you can help?', moduleId: 'viewmodels/volunteer', nav: true },
                   { route: 'aboutus', moduleId: 'viewmodels/aboutus', title: 'About Us', nav: true },
                   { route: 'admin', moduleId: 'viewmodels/admin/login', title: 'Admin', loginUrl : '/app/views/admin/login.html' }
                ];

            if(storage.local("userConfig") && storage.local("userConfig").USER_ROLE){
                if(storage.local("userConfig").USER_ROLE.code && storage.local("userConfig").USER_ROLE.code != 'ANON'){
                    routes = storage.local("userConfig")._durandalRoutes;
                    this.username(storage.local("userConfig").user.username);
                    this.photo(storage.local("userConfig").user.photo);
                }
            }

            router.map(routes).buildNavigationModel();
        };

        this.uiconfig = uiconfig;
        this.router = router;
        var navbarInstance = new navbarViewModel({ router: router });
        this.navbar = navbarInstance.navbar;
        this.username = ko.observable();
        this.photo = ko.observable();
        console.log(this.navbar);
        this.init();
    };

    shell.prototype = {
        //navbar: (new navbar({ router: router })).navbar,
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
        },
        logout : function(data, event){
            storage.local("userConfig", null);
            window.location = services.getLogoutLink();
        }
    }

    return new shell();
});