define(function(require) {
    var services = require('services');

    var wigdet = function() {
    	this.firstName = ko.observable();
    	this.lastName = ko.observable();
    	this.phone = ko.observable();
    	this.email = ko.observable();
    };

    wigdet.prototype = {
    	activate : function(settings){

    	},
    	submit : function(data, event){
    		var formData = new FormData();
    		//return;
    		formData.append('data', JSON.stringify({ 
    								  firstName : ko.unwrap(data.firstName()),
    								  lastName : ko.unwrap(data.lastName()),
    								  phone : ko.unwrap(data.phone()),
    								  email : ko.unwrap(data.email())
    								}));

			services.saveNewVolunteer(formData).then(function(result){
            	//console.log(result);
            	alert('success***********');
            }, function(err){
                throw new Error('Error submitting application', err);
            });
    	}
    };

    return wigdet;
});