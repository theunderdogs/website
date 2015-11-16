define(function(require) {
    var page = require('viewmodels/page'),
    	services = require('services');
    
    var vm = function() {
		page.call(this);
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    vm.prototype.activate = function(id){
    	var self = this;
    	this.headerTitle(id ? 'Edit New User' : 'Add New User');
		this.smallHeaderTitle(id ? 'Edit New User' : 'Add New User');

		this.breadCrumbs = ko.observableArray([
			{
				class1: 'fa fa-home',
				title: 'Home',
				class2: 'fa fa-angle-right'
			}, {
				title: 'Form Stuff',
				class2: 'fa fa-angle-right'
			}, {
				title: 'Form Layouts'
			}]);

    	if(id){
    		var formData = new FormData();
    		formData.append('data', JSON.stringify({ id : id }));

    		return services.getUserById(formData).then(function(user){
            		self.widgetCollection.push({ kind : 'addNewUser', data: { userToEdit : user.object } });		
                }, function(err){
	                throw new Error('Error fetching user', err);
	            });

    	}else{
    		this.widgetCollection.push({ kind : 'addNewUser', data: {} });
    	}
    };

    return vm;  //vm extends page
});