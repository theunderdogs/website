define(function (require) {
	require('cropper');
	require('bootstrap');
	require('datepicker');
	require('mixitup');
	require('toBlob');

    var services = require('services'),
    	_ = require("lodash"),
    	uiConfig = require('classes/uiconfig');

	var vm = function(){
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
	};

	vm.prototype = {
		activate : function(options){
			var self = this;
			this.options = options;

			if(this.options.data.petid){
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

					for(var i = 0; i < self.availableGenders().length; i++){
						if(self.availableGenders()[i].code == self.petToEdit.gender.code){
							self.selectedGender(self.availableGenders()[i]);
							break;
						}
					}

					var promisePhotoUrls = [];

					for(var i = 0; i < self.petToEdit.photoUrls.length; i++){
						promisePhotoUrls.push(uiConfig.getCanvasFromImage(self.petToEdit.photoUrls[i].replace('thumbnails','')));
					}					

					return Promise.all(promisePhotoUrls)
		                .then(function(canvasArray){
		                    console.log('Promise resolved');
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
				  minContainerWidth : 500,
				  minContainerHeight: 500
			});

			if(this.options.data.petid){
				//for edits
				 $(this.view).find('.mix-grid').mixitup();
				$(view).find('.date-picker').eq(0).datepicker("setDate", this.dateFound());
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