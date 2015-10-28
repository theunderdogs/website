define(function (require) {
	var services = require('services'),
    	_ = require("lodash");

	var vm = function(){
		this.firstName = ko.observable();
		this.lastName = ko.observable();
		this.phone = ko.observable();
		this.email = ko.observable();
		this.address = ko.observable();
	};

	vm.prototype = {
		
	};

	return vm;
});