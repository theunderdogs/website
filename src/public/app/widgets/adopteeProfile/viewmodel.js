define(function (require) {
	var services = require('services'),
    	_ = require("lodash"),
    	router = require('plugins/router');

	var vm = function(settings){
		var self = this;
		this.view;
		this.settings = settings;
	};

	vm.prototype = {
		activate : function(){

		},
		compositionComplete : function(view, parent){
			this.view = view;
			this.openModal();
		},
		openModal : function(data, event){
			$(this.view).modal('show');
			return;
		},
		closeModal : function(data, event){
			$(this.view).modal('hide');
			return;
		},
		setStatusForApplication : function(statusCode){
			var formData = new FormData();
    		//return;
    		formData.append('data', JSON.stringify({ 
    								  answer : statusCode,
    								  application : JSON.stringify( this.settings.data ), //aplication
									}));


			services.setStatusForApplication(formData).then(function(result){
            	console.log(result);
            	router.activeItem().activate();
            	//alert('success***********');
            }, function(err){
                throw new Error(err.message);
            });

			return;
		}
	};

	return vm;
});