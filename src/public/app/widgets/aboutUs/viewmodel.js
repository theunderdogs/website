define(function (require) {
	require('cropper');
	require('bootstrap');
	require('datepicker');
	require('mixitup');
	require('toBlob');

    var services = require('services'),
    	_ = require("lodash");

	var vm = function(){
		this.aboutUsHtml = ko.observable();
	};

	vm.prototype = {
		activate : function(settings){
			var self = this;

			return services.getAboutUsHtml().then(function(result){
    			if(result.object){
    				self.aboutUsHtml(result.object.html);
    			}
    		});
		}
	};

	return vm;
});