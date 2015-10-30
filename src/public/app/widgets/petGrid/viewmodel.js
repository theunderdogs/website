define(function (require) {
	require('cropper');
	require('bootstrap');
	require('mixitup');
	
    var services = require('services'),
    	_ = require("lodash"),
    	//adoptionFormHtml = require('text!widgets/adoptionForm/view.html'),
    	adoptionFormViewModel = require('widgets/adoptionForm/viewmodel'),
        petInfoViewModel = require('widgets/petInfo/viewmodel');

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
            var petInfoInstance = new petInfoViewModel({ data : data, showAdoptMe : true });

            self.petInfoWidget({ 
                model: petInfoInstance, 
                view: 'widgets/petInfo/view.html' 
            });

        };
    };

    vm.prototype = {
    	activate : function(settings){
    		var self = this;
    		var promises = [];
    		promises.push(services.getPets());

    		return Promise.all(promises).then(function(result){
    			self.petsToDisplay(result[0].object);
    		});
    	},
    	compositionComplete : function(view, parent){
    		this.view = view;
			$(this.view).find('.mix-grid').mixitup();
    	}
    };

    return vm;
});