define(function (require) {
	require('cropper');
	require('bootstrap');
	require('mixitup');
	
    var services = require('services'),
    	_ = require("lodash"),
    	//adoptionFormHtml = require('text!widgets/adoptionForm/view.html'),
    	adoptionFormViewModel = require('widgets/adoptionForm/viewmodel'),
        petInfoViewModel = require('widgets/petInfo/viewmodel'),
        router = require('plugins/router');

    var vm = function(){
    	var self = this;
    	this.view;
    	this.petsToDisplay = ko.observableArray();
    	this.adoptionFormWidget =  ko.observable();
        this.petInfoWidget =  ko.observable();
    	this.formModal;

    	this.openAdoptMe = function(data, event){
    		// event = event || window.event;

    		// event.preventDefault();

    		// var $target = $(event.currentTarget);
    		// var $parent = $target.parent();

    		var adoptionFromInstace = new adoptionFormViewModel({ data : data });

    		self.adoptionFormWidget({ 
    			model: adoptionFromInstace, 
    			view: 'widgets/adoptionForm/view.html' 
    		});

    	};

        this.openPetInfo = function(data, event){
            var petInfoInstance = new petInfoViewModel({ data : data, showAdoptMe : self.settings.data.showAdoptMe,
                showNotes : self.settings.data.showNotes
             });

            self.petInfoWidget({ 
                model: petInfoInstance, 
                view: 'widgets/petInfo/view.html' 
            });

        };

        this.editPetInfo = function(data, event){
            router.navigate('editPet/' + data._id);
        };
    };

    vm.prototype = {
    	activate : function(settings){
    		var self = this;
            this.settings = settings;
    		this.petsToDisplay(settings.data.petsToDisplay);
    	},
    	compositionComplete : function(view, parent){
    		this.view = view;
			$(this.view).find('.mix-grid').mixitup();
    	}
    };

    return vm;
});