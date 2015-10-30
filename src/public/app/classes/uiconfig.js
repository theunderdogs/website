define(function(require) {
    //var ko = require('knockout'),
    //	$ = require('jquery');

    var showSidebar = ko.observable(),
        router = require('plugins/router');

    showSidebar.subscribe(function(newValue){
            if(newValue){
                $('body').removeClass('page-sidebar-closed, page-sidebar-dissapear');
            }else{
                $('body').removeClass('page-sidebar-closed').addClass('page-sidebar-dissapear');
            }
        });

    return {
        showSidebar: showSidebar,
        showNotificationIcon: ko.observable(false),
        showTopMenu: ko.observable(false),
        showLogout: ko.observable(false),
        rebuildRouter : function(routeArray){
                router.deactivate();
                router.reset();
                router.routes = [];
                router.map(routeArray).buildNavigationModel();
                return router.activate({pushState : false});
        }
    };
});