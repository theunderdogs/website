define(function(require) {
    //var ko = require('knockout'),
    	//$ = require('jquery');
    var uiconfig = require('classes/uiconfig');

    var vm = function(settings){
        this.settings = settings;
    	this.uiconfig = uiconfig;
    	this.router = null;
    };

    vm.prototype = {
    	getView : function(){
    		return 'customWidgets/nav/nav.html';
    	}
    }

    return new vm();
});