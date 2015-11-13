define(function(require) {
    var page = require('viewmodels/page'),
    	services = require('services');
    
    var vm = function() {
		page.call(this, {
			headerTitle : 'Users',
			smallHeaderTitle : 'Users',
			breadCrumbs : [
				{
					class1: 'fa fa-home',
					title: 'Home',
					class2: 'fa fa-angle-right'
				}, 
				{
					title: 'Users'
				}
			]
		});		
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    vm.prototype.activate = function(){
    	var self= this,
    		promises = [];

    		promises.push(services.getUsers());

    	return Promise.all(promises).then(function(result){
    			self.widgetCollection.push({ kind : 'userGrid', data: { usersToDisplay : result[0].object } });
    		});
    };

    return vm;  //vm extends page
});