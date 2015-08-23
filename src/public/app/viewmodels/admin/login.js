define(function(require) {
    var ko = require('knockout'),
    	$ = require('jquery');

    var vm = function(){
    	
    };

    vm.prototype = {
    	getView : function(){
    		return 'views/admin/login.html';
    	}
    }

    return new vm();
});