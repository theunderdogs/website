define(function(require) {
    //var ko = require('knockout'),
    	//$ = require('jquery');
    var uiconfig = require('classes/uiconfig');
    
    var vm = function(settings){
        this.uiconfig = uiconfig;
    	this.router = settings.router;
    };

    vm.prototype = {
    	getView : function(){
    		return 'customWidgets/nav/nav.html';
    	},
        /**
            activate is requred for the nav.html to render
        **/
        activate : function(){
            return true;
        }
    }

    return function navBar(settings){ 
        this.navbar = new vm(settings);
    };
});