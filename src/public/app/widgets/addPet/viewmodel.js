define(function (require) {
	require('cropper');
    var services = require('services');

	var vm = function(){
		this.name = ko.observable().extend({
                     required: true
                     // { 
                     // 	params: true, 
                     // 	message: 'Name is needed'
                     // }
                 });
		this.kind = ko.observable();
		this.photoUrl = ko.observable('../app/assets/images/gallery/image4.jpg');
		this.fileUpload;
		this.modal;
		this.picArray = ko.observableArray([]);
		this.cropperContainer;
	};

	vm.prototype = {
		activate : function(settings){

		},
	 	compositionComplete : function(view, parent){
			this.fileUpload = $(view).find('#fileUpload').eq(0);
			this.modal = $(view).find('#responsive').eq(0);
			this.cropperContainer = $(view).find('.myImage').eq(0);
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
    		data.picArray.push(result);  //data.photoUrl()
    		data.modal.modal('hide');
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
    								  kind : ko.unwrap(data.kind()) 
    								}));

    		var promiseArray = [];

    		$.each(data.picArray(), function( index, value ) {
				promiseArray.push(new Promise(function(resolve, reject){  
					  value.toBlob(function(blob){
					  	formData.append('filesToBeUploaded', blob);
					  	resolve();
					  });
				}));
			});
        	
    		Promise.all(promiseArray).then(function(){
    			services.saveNewPet(formData).then(function(result){
                	console.log(result);
                	alert('success***********');
	            }, function(err){
	                throw new Error('Error saving pet' + err);
	            });
    		});
    	}
	};

	return vm;
});