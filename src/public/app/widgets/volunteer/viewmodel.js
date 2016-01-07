define(function(require) {
    var services = require('services'),
        toastr = require('toastr'),
         uiconfig = require('classes/uiconfig'),
        router = require('plugins/router');

    var wigdet = function() {
        var self = this;

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
                        message: 'First name must have alphabets only'
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

        this.submitHandler = this.submit.bind(this);
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
    };

    wigdet.prototype = {
    	activate : function(settings){
            var self = this;
    	},
        attached : function(view, parent, settings){
            var self = this;

            grecaptcha.render( $(view).find('#captchaDiv')[0], {
                      sitekey : uiconfig.captchaKey,
                      theme : 'light',
                      callback : self.verifyCaptcha,
                      parentModule : self
                    });
        },
        submit : function(data, event){
            //validate fields
            var validObservable = ko.validatedObservable(this);

            if(!validObservable.isValid()){
                this.captchaResponse(null);
                grecaptcha.reset();
                return validObservable.errors.showAllMessages();
                //var v = ko.validation.group(data);
                //return v.showAllMessages(); 
            }

            //var validationGroup = ko.validation.group(data);

            //check if the application is already submitted
            var key = this.firstName() + this.lastName() + this.phone() + this.email();
            if(storage.local(key)){
                return toastr.info('Looks like you have already submitted your application', 'Application already submitted', {timeOut: 5000});
            }

            //verify captcha
            // if(!this.captchaResponse() || this.captchaResponse().length == 0){
            //     alert("You can't leave Captcha Code empty");
            //     return;
            // }else{
            //     //set value of captcha to null
            //     this.captchaResponse(null);
            // }

    		var formData = new FormData();
    		
    		formData.append('data', JSON.stringify({ 
    								  firstName : ko.unwrap(this.firstName()),
    								  lastName : ko.unwrap(this.lastName()),
    								  phone : ko.unwrap(this.phone()),
    								  email : ko.unwrap(this.email())
    								}));

            uiconfig.showLoading(true);
           services.saveNewVolunteer(formData).then(function(result){
              uiconfig.showLoading(false);
              storage.local(key, key);

            	toastr.success('We will contact you shortly', 'Application received', {timeOut: 5000});

                router.navigate('');
                //https://github.com/CodeSeven/toastr
            //toastr.success('We do have the Kapua suite available.', 'Turtle Bay Resort', {timeOut: 5000})
            }, function(err){
                grecaptcha.reset();
                toastr.error('Something went wrong while submitting your application', 'Error', {timeOut: 5000});
                //throw new Error('Error submitting application', err);
            });
    	}
    };

    return wigdet;
});