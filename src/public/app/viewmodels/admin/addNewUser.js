define(function(require) {
    var page = require('viewmodels/page');
    
    var vm = function() {
		page.call(this, {
			headerTitle : 'Add New User',
			smallHeaderTitle : 'Add New User',
			breadCrumbs : [
				{
					class1: 'fa fa-home',
					title: 'Home',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Forms',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Add New User'
				}
			]
		});

		//this.headerTitle('Add a pet');
		//this.smallHeaderTitle('Add a pet');
		
		this.widgetCollection.push({ kind : 'addNewUser', data: {} });
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    return vm;  //vm extends page
});