define(function(require) {
    var page = require('viewmodels/page'),
    	services = require('services');
    
    vm = function() {
		page.call(this, {
			headerTitle : 'Adoptable Pets',
			smallHeaderTitle : 'Adoptable Pets',
			breadCrumbs : [
				{
					class1: 'fa fa-home',
					title: 'Home',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Pages',
					class2: 'fa fa-angle-right'
				}, {
					title: 'Adoptable Pets'
				}
			]
		});

		//this.headerTitle('Add a pet');
		//this.smallHeaderTitle('Add a pet');
		
		//this.widgetCollection.push({ kind : 'aboutUs', data: {} });
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    vm.prototype.activate = function(){
    	var self= this,
    		promises = [];

    		promises.push(services.getAdoptablePets());

    	return Promise.all(promises).then(function(result){
    			self.widgetCollection.push({ kind : 'petGrid', data: { petsToDisplay : result[0].object, showAdoptMe : true, showNotes : false, showEdit : false } });
    		});
    };

    return vm;  //vm extends page
});