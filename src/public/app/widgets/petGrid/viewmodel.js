define(function (require) {
	require('cropper');
	require('bootstrap');
	require('mixitup');
	
    var services = require('services'),
    	_ = require("lodash");

    var vm = function(){
    	this.view;
    	this.petsToDisplay = ko.observableArray();
    };

    vm.prototype = {
    	activate : function(settings){
    		var self = this;
    		var promises = [];
    		promises.push(services.getPets());

    		return Promise.all(promises).then(function(result){
    			self.petsToDisplay(result[0].object);
    		});
    	},
    	compositionComplete : function(view, parent){
    		this.view = view;

    		//find('.mix-grid')
    		$(this.view).mixitup();
    	}
    };

    return vm;
});