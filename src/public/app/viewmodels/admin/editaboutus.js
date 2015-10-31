define(function(require) {
    var page = require('viewmodels/page');
    
    vm = function() {
		page.call(this, {
			headerTitle : 'Edit \'About Us\'',
			smallHeaderTitle : 'Edit \'About Us\'',
			breadCrumbs : [
				{
					class1: 'fa fa-home',
					title: 'Pages',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Forms',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Edit \'About Us\''
				}
			]
		});

		//this.headerTitle('Add a pet');
		//this.smallHeaderTitle('Add a pet');
		
		this.widgetCollection.push({ kind : 'editaboutUs', data: {} });
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    return vm;  //vm extends page
});