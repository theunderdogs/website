define(function (require) {
	require('uniform');

	var services = require('services'),
		toastr = require('toastr'),
    	_ = require("lodash"),
        uiconfig = require('classes/uiconfig'),
        agreementViewModel = require('widgets/termsAndConditions/viewmodel');

	var vm = function(settings){
		var self = this;
		this.settings = settings;
		this.pet = settings.data;
		this.firstName = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'First name is required'
                     },
                     alphabetsOnly: {
                        //params: 'yay',
                        message: 'First name must have alphabets only'
                     }
                 });
		this.lastName = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Last name is required'
                     },
                     alphabetsOnly: {
                        //params: 'yay',
                        message: 'Last name must have alphabets only'
                     }
                 });
		this.phone = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Phone is required'
                     },
                     phone: {
                        //params: 'yay',
                        message: 'Phone must have 10 digits only'
                     }
                 });
		this.email = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Email is required'
                     },
                     email : { 
                                params: true, 
                                message: 'Email is not valid'
                     }
                 });
		this.address = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Email is required'
                     }
                 });
		this.status = ko.observable();
		this.view;

		var availableStatus = _.findByValues(services.dataTypes(), "type", ["applicationStatus"]);
			
		for(var i = 0; i < availableStatus.length; i++){
			if(availableStatus[i].code === 'NEWAPPLICATION'){
				this.status(availableStatus[i]);
				break;
			}
		}

		this.iagree = ko.observable();

		this.captchaResponse = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Captcha is required'
                     }
                 });

        this.verifyCaptcha = function(response){
            console.log(response);
            self.captchaResponse(response);
        };

        this.agreementWidget = ko.observable();

        this.openTermsAndConditionHandler = this.openTermsAndCondition.bind(this);
        this.submitAdoptionApplicationHandler = this.submitAdoptionApplication.bind(this);
	};

	vm.prototype = {
		activate : function(){

		},
		attached : function(view, parent){
			var self = this;

            grecaptcha.render( $(view).find('#captchaDiv')[0], {
                      sitekey :  uiconfig.captchaKey,
                      theme : 'light',
                      callback : self.verifyCaptcha,
                      parentModule : self
                    });
		},
		compositionComplete : function(view, parent){
			this.view = view;
			this.openModal();
			$('input[type=checkbox]').uniform();
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
			var validObservable = ko.validatedObservable(this);

            if(!validObservable.isValid()){
                this.captchaResponse(null);
                grecaptcha.reset();
                toastr.error('Please fix the errors before submitting', '', {timeOut: 3000});
                return validObservable.errors.showAllMessages();
                //var v = ko.validation.group(data);
                //return v.showAllMessages(); 
            }

            //var validationGroup = ko.validation.group(data);

            //check if the application is already submitted
            console.log('petid', this.pet._id);
            var key =  this.pet._id + this.firstName() + this.lastName() + this.phone() + this.email();
            if(storage.local(key)){
                return toastr.info('Looks like you have already submitted your application', '', {timeOut: 5000});
            }

			var formData = new FormData();
    		//return;
    		formData.append('data', JSON.stringify({ 
    								  firstName : ko.unwrap(this.firstName()),
    								  lastName : ko.unwrap(this.lastName()),
    								  phone : ko.unwrap(this.phone()),
    								  email : ko.unwrap(this.email()),
    								  address : ko.unwrap(this.address()),
									  animal : JSON.stringify( this.pet ),
									  notes : '',
									  status : JSON.stringify( ko.unwrap(this.status()) )
    								}));

            uiconfig.showLoading(true);

    		services.submitAdoptionApplication(formData).then(function(result){
            	uiconfig.showLoading(false);
                storage.local(key, key);
            	console.log(result);
            	toastr.success('We will contact you shortly', '', {timeOut: 5000});
            	data.closeModal();   
            }, function(err){
                uiconfig.showLoading(false);
            	grecaptcha.reset();
                toastr.error('Something went wrong while submitting your application', '', {timeOut: 5000});
            });
		},
		openTermsAndCondition : function(data, event){
			var instance = new agreementViewModel();

            this.agreementWidget({ 
                model: instance, 
                view: 'widgets/termsAndConditions/view.html' 
            });
		}
	};

	return vm;
});