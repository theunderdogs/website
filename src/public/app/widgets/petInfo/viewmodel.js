define(function (require) {
	var services = require('services'),
    	_ = require("lodash"),
    	router = require('plugins/router'),
    	uiconfig = require('classes/uiconfig');

    	var widget = function(settings){
    		var self = this;
			this.settings = settings;
			this.view;
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
			}
    	};

    	return widget;
});