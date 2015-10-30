define(function (require) {
	var services = require('services'),
    	_ = require("lodash"),
    	adopteeProfileViewModel = require('widgets/adopteeProfile/viewmodel');

	var vm = function(settings){
		var self = this;
		this.mailHeader = ko.observable();
		this.applications = [];// = ko.observableArray();
		this.displayApplications = ko.observableArray();
		this.adopteeProfileWidget = ko.observable();

		var availableLabels = _.findByValues(services.dataTypes(), "type", ["applicationStatus"]);
		var sortedAvailabelLabels = _.sortBy(availableLabels, 'order');
		this.availableLabels = ko.observableArray(sortedAvailabelLabels);

		this.selectedLabel = ko.observable();

		this.selectedLabel.subscribe(function(newLabel){
			self.mailHeader(newLabel);
	     	self.displayApplications([]);
	     	for(var i = 0; i < self.applications.length; i++){
	    		if(self.applications[i].status.optionValue === newLabel){
	    			self.displayApplications.push(self.applications[i]);
	    		}
	    	}
		});
	};

	vm.prototype = {
		activate : function(){
			var self = this;
    		var promises = [];
    		promises.push(services.getAdoptionApplications());

    		return Promise.all(promises).then(function(result){
    			self.applications = result[0].object;
    			self.selectedLabel(self.availableLabels()[0].optionValue);
    		});
		},
		onLabelClick : function(data){
			return this.selectedLabel(data.optionValue);
		},
	    formatDate : function(_date){
	    	var date =  new Date(_date);
	    	return date.getMonth() + '/' +  date.getDate() + '/' + date.getYear();
	    },
	    displayProfileModal : function(adopteeInfo){
	    	//alert(adopteeInfo.firstName);

	    	var adopteeProfileInstance = new adopteeProfileViewModel({ data : adopteeInfo });

    		this.adopteeProfileWidget({ 
    			model: adopteeProfileInstance, 
    			view: 'widgets/adopteeProfile/view.html' 
    		});
	    }
    };

	return vm;
});