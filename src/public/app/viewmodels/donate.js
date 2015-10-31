define(function(require) {
    var page = require('viewmodels/page'),
    	services = require('services');
    
    vm = function() {
		page.call(this, {
			headerTitle : 'Donate',
			smallHeaderTitle : 'Donate',
			breadCrumbs : [
				{
					class1: 'fa fa-home',
					title: 'Home',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Pages',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Donate'
				}
			]
		});

		//this.headerTitle('Add a pet');
		//this.smallHeaderTitle('Add a pet');
		
		this.widgetCollection.push({ kind : 'donate', data: {} });
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    return vm;  //vm extends page
});