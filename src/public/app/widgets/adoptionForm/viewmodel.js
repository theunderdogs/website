define(function (require) {
	var services = require('services'),
    	_ = require("lodash");

	var vm = function(settings){
		var self = this;
		this.settings = settings;
		this.pet = settings.data;
		this.firstName = ko.observable();
		this.lastName = ko.observable();
		this.phone = ko.observable();
		this.email = ko.observable();
		this.address = ko.observable();
		this.status = ko.observable();
		this.view;

		var availableStatus = _.findByValues(services.dataTypes(), "type", ["applicationStatus"]);
			
		for(var i = 0; i < availableStatus.length; i++){
			if(availableStatus[i].optionValue.toUpperCase() === 'NEW'){
				this.status(availableStatus[i]);
				break;
			}
		}
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
		submitAdoptionApplication : function(data, event){
			var formData = new FormData();
    		//return;
    		formData.append('data', JSON.stringify({ 
    								  firstName : ko.unwrap(this.firstName()),
    								  lastName : ko.unwrap(this.lastName()),
    								  phone : ko.unwrap(this.phone()),
    								  email : ko.unwrap(this.email()),
    								  address : ko.unwrap(this.address()),
									  animal : JSON.stringify( this.pet ),
									  status : JSON.stringify( ko.unwrap(this.status()) )
    								}));

    		services.submitAdoptionApplication(formData).then(function(result){
            	console.log(result);
            	alert('success***********');
            }, function(err){
                throw new Error(err.message);
            });
		}
	};

	return vm;
});