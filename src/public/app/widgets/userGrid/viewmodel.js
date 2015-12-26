define(function (require) {
	require('cropper');
	require('bootstrap');
	require('mixitup');
	
    var services = require('services'),
    	_ = require("lodash");
    	//adoptionFormHtml = require('text!widgets/adoptionForm/view.html'),
    	//adoptionFormViewModel = require('widgets/adoptionForm/viewmodel'),
        userInfoViewModel = require('widgets/userInfo/viewmodel'),
        router = require('plugins/router'),
         uiconfig = require('classes/uiconfig');

    var vm = function(){
    	var self = this;
    	this.view;
    	this.usersToDisplay = ko.observableArray();
    	this.adoptionFormWidget =  ko.observable();
        this.userInfoWidget =  ko.observable();
        this.formModal;

    	this.openUserInfo = function(data, event){
            var userInfoInstance = new userInfoViewModel({ data : data });

            self.userInfoWidget({ 
                model: userInfoInstance, 
                view: 'widgets/userInfo/view.html' 
            });
        };

        this.editUser = function(data, event){
            router.navigate('editUser/' + data._id);
        };
    };

    vm.prototype = {
    	activate : function(settings){
            uiconfig.showLoading(true);
    		var self = this;
            this.settings = settings;
    		this.usersToDisplay(settings.data.usersToDisplay);
    	},
    	compositionComplete : function(view, parent){
    		this.view = view;
			$(this.view).find('.mix-grid').mixitup();
            uiconfig.showLoading(false);
    	}  
    };

    return vm;
});