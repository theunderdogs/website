define(function(require) {
    var services = require('services'),
        uiConfig = require('classes/uiconfig');
    	_ = require("lodash"),
        toastr = require('toastr'),
        router = require('plugins/router');

    	require('cropper');
		require('bootstrap');
		require('datepicker');
    	require('mixitup');
		require('toBlob');

    var widget = function(){
        this.id;
        this.firstname = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'First name is required'
                     },
                     alphabetsOnly: {
                        //params: 'yay',
                        message: 'First name must have alphabets only'
                     }
                 });
    	this.lastname = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Last name is required'
                     },
                     alphabetsOnly: {
                        //params: 'yay',
                        message: 'Last name must have alphabets only'
                     }
                 });
    	this.username = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Username is required'
                     }
                 });
    	this.password = ko.observable().extend({
            required: {
                params: true,
                message: 'Password is required'
            },
            password: {
                message: 'Password must have atleast 8 characters, 1 number, 1 upper and 1 lowercase'
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
    	this.selectedRole = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Role is required'
                     }
                 });
    	this.photoUrl = ko.observable();
    	this.picArray = ko.observableArray().extend({
                     required: { 
                                params: true, 
                                message: 'Please select atleast one picture'
                     },
                     arrayMustContainAtLeast: {
                        length: 1,
                        message: 'Must have one picture only'
                     }
                 });
        this.availableStatus = ko.observableArray([{
            optionValue : 'No',
            value : true
        },{
            optionValue : 'Yes',
            value : false
        }]);
        this.isDisabled = ko.observable().extend({
                     required: { 
                                params: true, 
                                message: 'Status is required'
                     }
                 });

        this.userToEdit = null;

    	var availableRoles = _.findByValues(services.dataTypes(), "type", ["userRole"]);
		var sortedAvailableRoles = _.sortBy(availableRoles, 'order');
		this.availableRoles = ko.observableArray( _.remove(sortedAvailableRoles, function(n){
                return n.code != 'ANON'; 
        }) );
		
		this.view;
		this.cropperContainer;
		this.fileUpload;
		this.modal;

        this.deleteImageHandler = this.deleteImage.bind(this);
        this.submitFormHandler = this.submitForm.bind(this);
    };

    widget.prototype = {
        /*
        * for data to be edited
        */
        activate: function(options){
            var self = this;
            if(options && options.data && options.data.userToEdit){
                uiConfig.showLoading(true);
                console.log("options", options.data.userToEdit);
                this.id = options.data.userToEdit._id;
                this.userToEdit = options.data.userToEdit;    

                this.firstname(this.userToEdit.firstname);
                this.lastname(this.userToEdit.lastname);
                this.username(this.userToEdit.username);
                this.password(this.userToEdit.password);
                this.phone(this.userToEdit.phone);
                this.email(this.userToEdit.email);
                
                for(var i = 0; i < this.availableRoles().length; i++){
                    if(this.availableRoles()[i].code == this.userToEdit.role.code){
                        this.selectedRole(this.availableRoles()[i]);
                        break;
                    }
                }
                
                for(var i = 0; i < this.availableStatus().length; i++){
                    if(this.availableStatus()[i].value == this.userToEdit.isDisabled){
                        this.isDisabled(this.availableStatus()[i]);
                        break;
                    }
                }
            }
        },
    	addFiles : function(data, event){
    		this.fileUpload.trigger('click');
    		return false;
    	},
        deleteImage : function(data, event){
            //console.log(data);
            this.picArray([]);
        },
    	onFileUpload : function(data, event){
    		uiConfig.showLoading(true);
            var self = this;
    		var file = event.target.files[0];
	        var reader = new FileReader();

	        reader.onloadend = function (onloadend_e) 
	        {
	           var result = reader.result; // Here is your base 64 encoded file. Do with it what you want.
	           self.photoUrl(result);
	           self.cropperContainer.cropper('replace', self.photoUrl());
	           self.modal.modal('show');
               uiConfig.showLoading(false);
	        };

	        if(file)
	        {
	            reader.readAsDataURL(file);
	        }
    	},
    	cropImage : function(data, event){
            uiConfig.showLoading(true);
    		var result = this.cropperContainer.cropper('getCroppedCanvas');
    		data.photoUrl(result.toDataURL());
    		this.cropperContainer.cropper('replace', data.photoUrl());
    		data.picArray([{
    			canvas : result,
    			isNew : true
    		}]);  //data.photoUrl()
    		data.modal.modal('hide');
    		$(this.view).find('.mix-grid').mixitup();
            uiConfig.showLoading(false);
    	},
    	compositionComplete : function(view, parent){
            var self = this;
			this.fileUpload = $(view).find('#fileUpload').eq(0);
			this.modal = $(view).find('#responsive').eq(0);
			this.cropperContainer = $(view).find('.myImage').eq(0);
			this.view = view;
			//console.log('attached');

			this.cropperContainer.cropper({
				  aspectRatio: 16 / 9, //Set the aspect ratio of the crop box. By default, the crop box is free ratio.
				  autoCropArea: 0.65,
				  movable: false,
				  zoomable: false,
				  rotatable: false,
				  scalable: false,
				  //minContainerWidth : 500,
				  //minContainerHeight: 500
			});

            //for edit
            if(this.id){

                uiConfig.getCanvasFromImage(this.userToEdit.photo.replace('thumbnails',''))
                .then(function(canvas){
                    console.log('Promise resolved');
                    //console.warn(canvas.toDataURL());
                    self.picArray([{
                        canvas : canvas,
                        isNew : true
                    }]);  //data.photoUrl()
                    
                    $(self.view).find('.mix-grid').mixitup();
                    uiConfig.showLoading(false);
                });
            }
    	},
    	submitForm : function(data, event){
            var validObservable = ko.validatedObservable(this);

    		if(!validObservable.isValid()){
    			return validObservable.errors.showAllMessages();
    			//var v = ko.validation.group(data);
    			//return v.showAllMessages(); 
    		}

    		//var validationGroup = ko.validation.group(data);

            var jsonData = {};
            jsonData.firstname = ko.unwrap(data.firstname());
            jsonData.lastname = ko.unwrap(data.lastname());
            jsonData.username = ko.unwrap(data.username());
            jsonData.password = ko.unwrap(data.password());
            jsonData.phone = ko.unwrap(data.phone());
            jsonData.email = ko.unwrap(data.email());
            jsonData.role = JSON.stringify( ko.unwrap(data.selectedRole()) );
            jsonData.isDisabled = ko.unwrap(data.isDisabled().value);

            if(data.id){
                jsonData.id = data.id;
            }

    		var formData = new FormData();

            formData.append('data', JSON.stringify(jsonData));

    		var promiseArray = [];

    		$.each(data.picArray(), function( index, imageInfo ) {
				promiseArray.push(new Promise(function(resolve, reject){  
					  imageInfo.canvas.toBlob(function(blob){
					  	formData.append('filesToBeUploaded', blob);
					  	resolve();
					  }, 'image/jpeg', 1);
				}));
			});
        	
            uiConfig.showLoading(true);
    		Promise.all(promiseArray).then(function(){
    			services.saveUser(formData).then(function(result){
                    uiConfig.showLoading(false);
                	console.log(result);

                	toastr.success('New user has been added', 'User added', {timeOut: 5000});
                    router.navigate('users');
	            }, function(err){
                    uiConfig.showLoading(false);
                    console.log(err);
	                //throw new Error('Error saving user', err);
                    toastr.error(err.responseJSON.message, 'Oops!', {timeOut: 5000});
	            });
    		});
    	}
    }

    return widget;
});