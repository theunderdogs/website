define(function(require) {
	//var ko = require('knockout'),
    //	$ = require('jquery'),
    	//storage = require("storage");

    require('cropper');
    var services = require('services');
    
	var vm = function(){
		this.name = ko.observable();
		this.photoUrl = ko.observable('../app/assets/images/gallery/image4.jpg');
		this.fileUpload;
		this.modal;
		this.picArray = ko.observableArray([]);
    };

    vm.prototype = {
    	getView : function(){
    		return 'views/admin/addNewUser.html';
    	},
    	attached : function(view, parent){
    		this.fileUpload = $(view).find('#fileUpload').eq(0);
    		this.modal = $(view).find('#responsive').eq(0);
    		console.log('attached');

    		$('.myImage').cropper({
				  aspectRatio: 16 / 9, //Set the aspect ratio of the crop box. By default, the crop box is free ratio.
				  autoCropArea: 0.65,
				  //strict: false,
				  //guides: false,
				  //highlight: false,
				  //dragCrop: false,
				  //cropBoxMovable: false,
				  //cropBoxResizable: false,
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
	           $('.myImage').cropper('replace', self.photoUrl());
	           self.modal.modal('show');
	        };

	        if(file)
	        {
	            reader.readAsDataURL(file);
	        }
    	},
    	cropImage : function(data, e){
    		var result = $('.myImage').cropper('getCroppedCanvas');
    		data.photoUrl(result.toDataURL());
    		$('.myImage').cropper('replace', data.photoUrl());
    		data.picArray.push(result);  //data.photoUrl()
    		data.modal.modal('hide');
    	},
    	submitForm : function(data, e){
    		var formData = new FormData();

    		formData.append('data', ko.unwrap(data.name()));

    		$.each(data.picArray(), function( index, value ) {
			  value.toBlob(function(blob){
			  	formData.append('file[]', blob);
			  });
			  
			});
        	
        	services.saveNewPet(formData).then(function(result){
                console.log(result);
                alert('success***********');
            }, function(err){
                throw new Error('Error saving pet' + err);
            });
    	}
    }

    return new vm();
});