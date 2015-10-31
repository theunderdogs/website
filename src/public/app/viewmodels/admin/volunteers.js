define(function(require) {
    var page = require('viewmodels/page');
    
    vm = function() {
		page.call(this, {
			headerTitle : 'Volunteer applications',
			smallHeaderTitle : 'Volunteer applications',
			breadCrumbs : [
				{
					class1: 'fa fa-home',
					title: 'Pages',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Forms',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Volunteer applications'
				}
			]
		});

		//this.headerTitle('Add a pet');
		//this.smallHeaderTitle('Add a pet');
		
		this.widgetCollection.push({ kind : 'volunteerApplications', data: {} });
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    return vm;  //vm extends page
});