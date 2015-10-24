define(function(require) {
    
    
	var vm = function(){
		this.addPetWidget = { kind : 'addPet', data: {} };
    };

    vm.prototype = {
    	getView : function(){
    		return 'views/admin/addNewUser.html';
    	}
    }

    return new vm();
});