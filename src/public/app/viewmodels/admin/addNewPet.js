define(function(require) {
    var page = require('viewmodels/page');
    
    vm = function() {
		page.call(this, {
			headerTitle : 'Add new pet',
			smallHeaderTitle : 'Add new pet',
			breadCrumbs : [
				{
					class1: 'fa fa-home',
					title: 'Home',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Forms',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Add a pet'
				}
			]
		});

		//this.headerTitle('Add a pet');
		//this.smallHeaderTitle('Add a pet');
		
		
    };

    vm.prototype = Object.create(page.prototype);

    var _super_ = page.prototype;

    vm.prototype.activate = function(id) {
        if(id){
        	this.widgetCollection.push({ kind : 'addPet', data: { petid: id } });
        }else{
        	this.widgetCollection.push({ kind : 'addPet', data: {} });
        }
    };

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    return vm;  //vm extends page
});