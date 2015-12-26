define(function(require) {
    var page = require('viewmodels/page'),
        services = require('services'),
        uiconfig = require('classes/uiconfig');
    
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
    };

    vm.prototype = Object.create(page.prototype);

    // var _super_ = page.prototype;

    // John.prototype.walk = function() {
    //     return _super_.walk.call(this) + ' quickly';
    // };

    vm.prototype.activate = function(){
    	var self= this,
    		promises = [];

            uiconfig.showLoading(true);
    		promises.push(services.getPets());

    	return Promise.all(promises).then(function(result){
    			self.widgetCollection.push({ kind : 'petGrid', data: { petsToDisplay : result[0].object, showAdoptMe : false, showNotes : true, showEdit : true } });
                uiconfig.showLoading(false);
    		});
    };

    return vm;  //vm extends page
});