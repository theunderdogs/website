define(function(require) {
    var ko = require('knockout'),
    	$ = require('jquery');

    var vm = function(){
    	this.showSidebar = ko.observable(true);

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