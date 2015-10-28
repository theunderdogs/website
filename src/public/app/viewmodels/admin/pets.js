define(function(require) {
    var page = require('viewmodels/page');
    
    vm = function() {
		page.call(this, {
			headerTitle : 'Pets',
			smallHeaderTitle : 'Pets',
			breadCrumbs : [
				{
					class1: 'fa fa-home',
					title: 'Home',
					class2: 'fa fa-angle-right'
				}, 
				{
					title: 'Pets'
				}
			]
		});

		this.widgetCollection.push({ kind : 'petGrid', data: {} });
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    return vm;  //vm extends page
});