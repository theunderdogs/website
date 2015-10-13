define(function(require) {
	//var ko = require('knockout'),
    //	$ = require('jquery'),
    	//storage = require("storage");

    var services = require('services');
    
	var vm = function(){


    };

    vm.prototype = {
    	getView : function(){
    		return 'views/admin/addNewPet.html';
    	}
    }

    return new vm();
});