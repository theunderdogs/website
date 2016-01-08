define(function (require) {
	var services = require('services'),
    	_ = require("lodash"),
    	router = require('plugins/router'),
    	uiconfig = require('classes/uiconfig');
    	//adoptionFormViewModel = require('widgets/adoptionForm/viewmodel');

    	var widget = function(settings){
    		var self = this;
			this.settings = settings;
			this.bigImage = ko.observable(settings.data.photo);
			this.view;
			//this.adoptionFormWidget =  ko.observable();

			this.onThumbnailClick = function(){
				//console.log(data);
				//self.bigImage(settings.data.photo);
				return;
			}
    	};

    	widget.prototype = {
    		activate : function(){

			},
			compositionComplete : function(view, parent){
				this.view = view;
				this.openModal();
			},
			openModal : function(data, event){
				$(this.view).modal('show');
				return;
			},
			closeModal : function(data, event){
				$(this.view).modal('hide');
				return;
			},
			// openAdoptMe : function(data, event){
	  //   		var adoptionFromInstace = new adoptionFormViewModel({ data : this.settings.data });

	  //   		this.adoptionFormWidget({ 
	  //   			model: adoptionFromInstace, 
	  //   			view: 'widgets/adoptionForm/view.html' 
	  //   		});

	  //   	}
    	};

    	return widget;
});