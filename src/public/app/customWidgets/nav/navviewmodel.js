define(function(require) {
    var ko = require('knockout'),
    	$ = require('jquery');

    var vm = function(settings){
        this.settings = settings;
    	this.showSidebar = ko.observable();

    	this.showSidebar.subscribe(function(newValue){
    		if(newValue){
    			$('body').removeClass('page-sidebar-closed, page-sidebar-dissapear');
    		}else{
    			$('body').removeClass('page-sidebar-closed').addClass('page-sidebar-dissapear');
    		}
    	});

    	this.router = null;
    };

    vm.prototype = {
    	getView : function(){
    		return 'customWidgets/nav/nav.html';
    	}
    }

    return new vm();
});