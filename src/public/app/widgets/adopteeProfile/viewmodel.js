define(function (require) {
	var services = require('services'),
    	_ = require("lodash");

	var vm = function(settings){
		var self = this;
		this.view;
		this.settings = settings;
		this.notes = ko.observable();
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
		setStatusForApplication : function(answer){
			this.settings.data.notes = ko.unwrap(this.notes());

			var formData = new FormData();
    		//return;
    		formData.append('data', JSON.stringify({ 
    								  answer : answer,
    								  application : JSON.stringify( this.settings.data ), //aplication
									}));


			services.setStatusForApplication(formData).then(function(result){
            	console.log(result);
            	alert('success***********');
            }, function(err){
                throw new Error(err.message);
            });

			return;
		}
	};

	return vm;
});