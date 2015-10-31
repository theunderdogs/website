define(function (require) {
	require('cropper');
	require('bootstrap');
	require('datepicker');
	require('mixitup');
	require('toBlob');

    var services = require('services'),
    	_ = require("lodash");

	var vm = function(){
		this.name = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'This field is required'
			         }
                 });
		this.photoUrl = ko.observable('../app/assets/images/gallery/image4.jpg');
		this.fileUpload;
		this.modal;
		this.picArray = ko.observableArray([]);
		this.cropperContainer;
		this.view;
		
		var availableKinds = _.findByValues(services.dataTypes(), "type", ["animalKind"]);
		var sortedAvailabelKinds = _.sortBy(availableKinds, 'order');
		this.availableKinds = ko.observableArray(sortedAvailabelKinds);
		this.selectedKind = ko.observable().extend({
                     required: true
                 });
		this.specifyKind = ko.observable();

		var availableGenders = _.findByValues(services.dataTypes(), "type", ["gender"]);
		var sortedAvailabelGenders = _.sortBy(availableGenders, 'order');
		this.availableGenders = ko.observableArray(sortedAvailabelGenders);
		this.selectedGender = ko.observable();

		// var availableStatuses = _.findByValues(services.dataTypes(), "type", ["animalStatus"]);
		// var sortedAvailableStatuses = _.sortBy(availableStatuses, 'order');
		// this.availableStatuses = ko.observableArray(sortedAvailableStatuses);
		// this.selectedStatus = ko.observable();

		this.age = ko.observable();
		this.color = ko.observable();

		this.weight = ko.observable();
		this.dateFound = ko.observable();

		this.breed = ko.observable();
		this.notes = ko.observable();
		this.bio = ko.observable();
		this._id = ko.observable();
	};

	vm.prototype = {
		activate : function(settings){
			this.settings = settings;

			if(this.settings._id){
				this._id(this.settings._id);
			}
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

			$(view).find('.date-picker').eq(0).datepicker({});
    	},
    	addFiles : function(data, e){
    		this.fileUpload.trigger('click');
    		return false;
    	},
    	onFileUpload : function(data, e){
    		var self = this;
    		var file = e.target.files[0];
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
    	cropImage : function(data, e){
    		var result = this.cropperContainer.cropper('getCroppedCanvas');
    		data.photoUrl(result.toDataURL());
    		this.cropperContainer.cropper('replace', data.photoUrl());
    		data.picArray.push({
    			canvas : result,
    			isNew : true
    		});  //data.photoUrl()
    		data.modal.modal('hide');
    		$(this.view).find('.mix-grid').mixitup();
    	},
    	submitForm : function(data, e){
    		var validObservable = ko.validatedObservable(data);

    		if(!validObservable.isValid()){
    			return validObservable.errors.showAllMessages();
    			//var v = ko.validation.group(data);
    			//return v.showAllMessages(); 
    		}

    		//var validationGroup = ko.validation.group(data);

    		var formData = new FormData();
    		//return;
    		formData.append('data', JSON.stringify({ name : ko.unwrap(data.name()),
    								  gender : JSON.stringify( ko.unwrap(data.selectedGender()) ),
    								  kind : JSON.stringify( ko.unwrap(data.selectedKind()) ),
    								  specifyKind : ko.unwrap(data.specifyKind()),
    								  breed : ko.unwrap(data.breed()),
									  color : ko.unwrap(data.color()),
									  weight : ko.unwrap(data.weight()),
									  dateFound : ko.unwrap(data.dateFound()),
									  age : ko.unwrap(data.age()),
									  bio : ko.unwrap(data.bio()),
									  //status : JSON.stringify( ko.unwrap(data.selectedStatus()) ),
    								  notes : ko.unwrap(data.notes())
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
    			services.saveNewPet(formData).then(function(result){
                	console.log(result);
                	alert('success***********');
	            }, function(err){
	                throw new Error('Error saving pet', err);
	            });
    		});
    	},
    	deleteImage : function(data, event){
    		
    	}
	};

	return vm;
});