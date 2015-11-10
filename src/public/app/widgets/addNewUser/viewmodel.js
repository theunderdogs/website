define(function(require) {
    var services = require('services'),
    	_ = require("lodash");

    	require('cropper');
		require('bootstrap');
		require('datepicker');
    	require('mixitup');
		require('toBlob');

    var widget = function(){
    	this.firstname = ko.observable();
    	this.lastname = ko.observable();
    	this.username = ko.observable();
    	this.password = ko.observable();
    	this.phone = ko.observable();
    	this.email = ko.observable();
    	this.selectedRole = ko.observable();
    	this.photoUrl = ko.observable();
    	this.picArray = ko.observableArray();

    	var availableRoles = _.findByValues(services.dataTypes(), "type", ["userRole"]);
		var sortedAvailableRoles = _.sortBy(availableRoles, 'order');
		this.availableRoles = ko.observableArray(sortedAvailableRoles);
		this.selectedRole = ko.observable();

		this.view;
		this.cropperContainer;
		this.fileUpload;
		this.modal;
    };

    widget.prototype = {
    	addFiles : function(data, event){
    		this.fileUpload.trigger('click');
    		return false;
    	},
    	onFileUpload : function(data, event){
    		var self = this;
    		var file = event.target.files[0];
	        var reader = new FileReader();

	        reader.onloadend = function (onloadend_e) 
	        {
	           var result = reader.result; // Here is your base 64 encoded file. Do with it what you want.
	           self.photoUrl(result);
	           self.cropperContainer.cropper('replace', self.photoUrl());
	           self.modal.modal('show');
	        };

	        if(file)
	        {
	            reader.readAsDataURL(file);
	        }
    	},
    	cropImage : function(data, event){
    		var result = this.cropperContainer.cropper('getCroppedCanvas');
    		data.photoUrl(result.toDataURL());
    		this.cropperContainer.cropper('replace', data.photoUrl());
    		data.picArray([{
    			canvas : result,
    			isNew : true
    		}]);  //data.photoUrl()
    		data.modal.modal('hide');
    		$(this.view).find('.mix-grid').mixitup();
    	},
    	compositionComplete : function(view, parent){
			this.fileUpload = $(view).find('#fileUpload').eq(0);
			this.modal = $(view).find('#responsive').eq(0);
			this.cropperContainer = $(view).find('.myImage').eq(0);
			this.view = view;
			console.log('attached');

			this.cropperContainer.cropper({
				  aspectRatio: 16 / 9, //Set the aspect ratio of the crop box. By default, the crop box is free ratio.
				  autoCropArea: 0.65,
				  movable: false,
				  zoomable: false,
				  rotatable: false,
				  scalable: false,
				  minContainerWidth : 500,
				  minContainerHeight: 500
			});
    	},
    	submitForm : function(data, event){
    		var validObservable = ko.validatedObservable(data);

    		if(!validObservable.isValid()){
    			return validObservable.errors.showAllMessages();
    			//var v = ko.validation.group(data);
    			//return v.showAllMessages(); 
    		}

    		//var validationGroup = ko.validation.group(data);

    		var formData = new FormData();
    		//return;
    		formData.append('data', JSON.stringify({ firstname : ko.unwrap(data.firstname()),
    								  lastname : JSON.stringify( ko.unwrap(data.lastname()) ),
    								  username : JSON.stringify( ko.unwrap(data.username()) ),
    								  password : ko.unwrap(data.password()),
    								  phone : ko.unwrap(data.phone()),
									  email : ko.unwrap(data.email()),
									  role : ko.unwrap(data.age()),
									}));

    		var promiseArray = [];

    		$.each(data.picArray(), function( index, imageInfo ) {
				promiseArray.push(new Promise(function(resolve, reject){  
					  imageInfo.canvas.toBlob(function(blob){
					  	formData.append('filesToBeUploaded', blob);
					  	resolve();
					  }, 'image/jpeg', 1);
				}));
			});
        	
    		Promise.all(promiseArray).then(function(){
    			services.saveNewUser(formData).then(function(result){
                	console.log(result);
                	alert('success***********');
	            }, function(err){
	                throw new Error('Error saving user', err);
	            });
    		});
    	}
    }

    return widget;
});