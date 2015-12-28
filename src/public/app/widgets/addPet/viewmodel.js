define(function (require) {
	require('cropper');
	require('bootstrap');
	require('datepicker');
	require('mixitup');
	require('toBlob');

    var services = require('services'),
    	_ = require("lodash"),
    	uiconfig = require('classes/uiconfig'),
    	toastr = require('toastr'),
        router = require('plugins/router');

	var vm = function(){
		var self = this;
		this.id;
		this.petToEdit;
		this.options;

		this.name = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'This field is required'
			         }
                 });
		this.photoUrl = ko.observable('../app/assets/images/gallery/image4.jpg');
		this.fileUpload;
		this.modal;
		this.picArray = ko.observableArray().extend({
                     required: { 
                                params: true, 
                                message: 'Please select atleast one picture'
                     },
                     arrayLessThanOrEqual: {
                        params: { length : 8 },
                        message: 'You can upload only 8 pictures'
                     }
                 });
		this.cropperContainer;
		this.view;
		
		var availableKinds = _.findByValues(services.dataTypes(), "type", ["animalKind"]);
		var sortedAvailabelKinds = _.sortBy(availableKinds, 'order');
		this.availableKinds = ko.observableArray(sortedAvailabelKinds);
		this.selectedKind = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Please select kind of animal'
			         }
                 });
		this.specifyKind = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Please enter what kind',
			                 	onlyIf: function() {
						            return self.selectedKind() && self.selectedKind().code === 'OTHER';
						        }
			         }
                 });

		var availableGenders = _.findByValues(services.dataTypes(), "type", ["gender"]);
		var sortedAvailabelGenders = _.sortBy(availableGenders, 'order');
		this.availableGenders = ko.observableArray(sortedAvailabelGenders);
		this.selectedGender = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Gender is required'
			         }
                 });

		// var availableStatuses = _.findByValues(services.dataTypes(), "type", ["animalStatus"]);
		// var sortedAvailableStatuses = _.sortBy(availableStatuses, 'order');
		// this.availableStatuses = ko.observableArray(sortedAvailableStatuses);
		// this.selectedStatus = ko.observable();

		this.age = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Age is required'
			         }
                 });
		this.color = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Color is required'
			         }
                 });

		this.weight = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Weight is required'
			         }
                 });
		this.dateFound = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Date is required'
			         }
                 });

		this.breed = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Breed is required'
			         }
                 });
		this.notes = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Notes are required'
			         }
                 });
		this.bio = ko.observable().extend({
                     required: { 
			                 	params: true, 
			                 	message: 'Bio is required'
			         }
                 });


    	this.deleteImage = function(data, event){
    		self.picArray.splice(self.picArray.indexOf(data), 1);
    	}
	};

	vm.prototype = {
		activate : function(options){
			var self = this;
			this.options = options;

			if(this.options.data.petid){
				uiconfig.showLoading(true);
				this._id = this.options.data.petid;
				
				var formData = new FormData();
    			formData.append('data', JSON.stringify({ id : this._id }));

				return services.getPetById(formData)
				.then(function (result) {
					self.petToEdit = result.object;
					self.name(self.petToEdit.name);
					self.breed(self.petToEdit.breed);
					self.color(self.petToEdit.color);
					self.weight(self.petToEdit.weight);
					self.age(self.petToEdit.age);
					
					var dateFound = new Date(self.petToEdit.dateFound);

					self.dateFound((dateFound.getMonth() + 1) + '/' + dateFound.getDate() + '/' + dateFound.getFullYear());
					self.notes(self.petToEdit.notes);
					self.bio(self.petToEdit.bio);

					for(var i = 0; i < self.availableKinds().length; i++){
						if(self.availableKinds()[i].code == self.petToEdit.kind.code){
							self.selectedKind(self.availableKinds()[i]);
							break;
						}
					}

					self.specifyKind(self.selectedKind().code === 'OTHER'? self.petToEdit.specifyKind : null);

					for(var i = 0; i < self.availableGenders().length; i++){
						if(self.availableGenders()[i].code == self.petToEdit.gender.code){
							self.selectedGender(self.availableGenders()[i]);
							break;
						}
					}

					var promisePhotoUrls = [];

					for(var i = 0; i < self.petToEdit.photoUrls.length; i++){
						promisePhotoUrls.push(uiconfig.getCanvasFromImage(self.petToEdit.photoUrls[i].replace('thumbnails','')));
					}					

					return Promise.all(promisePhotoUrls)
		                .then(function(canvasArray){
		                    
		                    //console.warn(canvas.toDataURL());
		                    for(var i = 0; i < canvasArray.length; i++){
			                    self.picArray.push({
			                        canvas : canvasArray[i],
			                        isNew : true
			                    });  //data.photoUrl()
			                }

			                //return Promise.resolve(true);
		                });
				});
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
				  //minContainerWidth : 500,
				  //minContainerHeight: 500
			});

			if(this.options.data.petid){
				//for edits
				 $(this.view).find('.mix-grid').mixitup();
				$(view).find('.date-picker').eq(0).datepicker("setDate", this.dateFound());
				uiconfig.showLoading(false);
			}
			else {
				$(view).find('.date-picker').eq(0).datepicker();
			}
    	},
    	addFiles : function(data, e){
    		this.fileUpload.trigger('click');
    		return false;
    	},
    	onFileUpload : function(data, e){
    		uiconfig.showLoading(true);
    		var self = this;
    		var file = e.target.files[0];
	        var reader = new FileReader();

	        reader.onloadend = function (onloadend_e) 
	        {
	           var result = reader.result; // Here is your base 64 encoded file. Do with it what you want.
	           self.photoUrl(result);
	           self.cropperContainer.cropper('replace', self.photoUrl());
	           self.modal.modal('show');
	           uiconfig.showLoading(false);
	        };

	        if(file)
	        {
	            reader.readAsDataURL(file);
	        }
    	},
    	cropImage : function(data, e){
    		uiconfig.showLoading(true);
    		var result = this.cropperContainer.cropper('getCroppedCanvas');
    		data.photoUrl(result.toDataURL());
    		this.cropperContainer.cropper('replace', data.photoUrl());
    		data.picArray.push({
    			canvas : result,
    			isNew : true
    		});  //data.photoUrl()
    		data.modal.modal('hide');
    		$(this.view).find('.mix-grid').mixitup();
    		uiconfig.showLoading(false);
    	},
    	submitForm : function(data, e){
    		var validObservable = ko.validatedObservable(data);

    		if(!validObservable.isValid()){
    			return validObservable.errors.showAllMessages();
    			//var v = ko.validation.group(data);
    			//return v.showAllMessages(); 
    		}

    		//var validationGroup = ko.validation.group(data);

    		var jsonData = { name : ko.unwrap(data.name()),
    								  gender : JSON.stringify( ko.unwrap(data.selectedGender()) ),
    								  kind : JSON.stringify( ko.unwrap(data.selectedKind()) ),
    								  specifyKind : data.selectedKind().code === 'OTHER'? ko.unwrap(data.specifyKind()) : null,
    								  breed : ko.unwrap(data.breed()),
									  color : ko.unwrap(data.color()),
									  weight : ko.unwrap(data.weight()),
									  dateFound : ko.unwrap(data.dateFound()),
									  age : ko.unwrap(data.age()),
									  bio : ko.unwrap(data.bio()),
									  //status : JSON.stringify( ko.unwrap(data.selectedStatus()) ),
    								  notes : ko.unwrap(data.notes())
    								};

    		if(this.options.data.petid){
                jsonData.id = this.options.data.petid;
            }

    		var formData = new FormData();
    		formData.append('data', JSON.stringify( jsonData ));

    		var promiseArray = [];

    		uiconfig.showLoading(true);
    		$.each(data.picArray(), function( index, imageInfo ) {
				promiseArray.push(new Promise(function(resolve, reject){  
					  imageInfo.canvas.toBlob(function(blob){
					  	formData.append('filesToBeUploaded', blob);
					  	resolve();
					  }, 'image/jpeg', 1);
				}));
			});
        	
    		Promise.all(promiseArray).then(function(){
    			services.savePet(formData).then(function(result){
    				uiconfig.showLoading(false);
                	console.log(result);
                	toastr.success('New pet has been added', 'Pet added', {timeOut: 5000});
                    router.navigate('pets');
	            }, function(err){
	            	uiconfig.showLoading(false);
	                console.log(err);
	                //throw new Error('Error saving user', err);
                    toastr.error('Something went wrong while saving pet', 'Oops!', {timeOut: 5000});
	            });
    		});
    	}
	};

	return vm;
});