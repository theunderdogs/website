define(function(require) {
    var services = require('services');

    var wigdet = function() {
        var self = this;

    	this.firstName = ko.observable();
    	this.lastName = ko.observable();
    	this.phone = ko.observable();
    	this.email = ko.observable();
        this.submitHandler = this.submit.bind(this);
        this.captchaResponse;

        this.verifyCaptcha = function(response){
            console.log(response);
            self.captchaResponse = response;
        };
    };

    wigdet.prototype = {
    	activate : function(settings){
            var self = this;
    	},
        attached : function(view, parent, settings){
            var self = this;

            grecaptcha.render( $(view).find('#captchaDiv')[0], {
                      sitekey : '6Lf3bhMTAAAAAPrzTxDV4IH6iN7fl1-gRBtuSafk',
                      theme : 'light',
                      callback : self.verifyCaptcha,
                      parentModule : self
                    });
        },
        submit : function(data, event){
            //var v = grecaptcha.getResponse();

            if(!this.captchaResponse || this.captchaResponse.length == 0){
                alert("You can't leave Captcha Code empty");
                return;
            }

    		var formData = new FormData();
    		
    		formData.append('data', JSON.stringify({ 
    								  firstName : ko.unwrap(this.firstName()),
    								  lastName : ko.unwrap(this.lastName()),
    								  phone : ko.unwrap(this.phone()),
    								  email : ko.unwrap(this.email())
    								}));

			services.saveNewVolunteer(formData).then(function(result){
            	alert('success***********');
            }, function(err){
                throw new Error('Error submitting application', err);
            });
    	}
    };

    return wigdet;
});