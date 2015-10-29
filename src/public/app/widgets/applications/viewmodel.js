define(function (require) {
	var services = require('services'),
    	_ = require("lodash"),
    	adopteeProfileViewModel = require('widgets/adopteeProfile/viewmodel');

	var vm = function(settings){
		this.pageIndex = ko.observable(3);
		this.mailHeader = ko.observable('New Applications');
		this.applications;// = ko.observableArray();
		this.displayApplications = ko.observableArray();
		this.adopteeProfileWidget = ko.observable();
	};

	vm.prototype = {
		activate : function(){
			var self = this;
    		var promises = [];
    		promises.push(services.getAdoptionApplications());

    		return Promise.all(promises).then(function(result){
    			//self.applications(result[0].object);
    			self.applications = result[0].object;
    			self.onLabelClick(self.pageIndex());
    		});
		},
		onLabelClick : function(index){
	    	this.pageIndex(index);

	    	if(index === 3){
	    		this.mailHeader('New Applications');
	    	} else if(index === 1){
	    		this.mailHeader('Accepted');
	    	} else if(index === 2){
	    		this.mailHeader('Rejected');
	    	}

	    	this.displayApplications([]);
	    	for(var i = 0; i < this.applications.length; i++){
	    		if(this.applications[i].status.optionValue === 'NEW' && index === 3){
	    			this.displayApplications.push(this.applications[i]);
	    		}
	    		if(this.applications[i].status.optionValue === 'REJECTED' && index === 2){
	    			this.displayApplications.push(this.applications[i]);
	    		}
	    		if(this.applications[i].status.optionValue === 'ACCEPTED' && index === 1){
	    			this.displayApplications.push(this.applications[i]);
	    		}
	    	}
	    },
	    tabLabel : function(index){
	    	if(index === 3){
	    		return 'New Applications';
	    	} else if(index === 1){
	    		return 'Accepted';
	    	} else if(index === 2){
	    		return 'Rejected';
	    	}
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