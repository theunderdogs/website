define(['plugins/http', 'durandal/app', 'knockout', 'jquery', 'bootstrap'], function (http, app) {
   
	var storage = require('storage'),
		ko = require('knockout');

	var services = function(){
		var self = this;
		this.token = storage.local('userConfig').token;
		this.dataTypes = ko.observable();
	}

	services.prototype = {
		getUsers : function(){
			return $.get('secure/getUsers?access_token=fool&token=' + this.token);
		},
		getLogoutLink : function(){
			return 'logout?access_token=fool&token=' + this.token;
		},
		saveNewPet : function(formData){
			return $.ajax('secure/saveNewPet?access_token=fool&token=' + this.token, {
			    method: "POST",
			    data: formData,
			    processData: false,
			    contentType: false
			  });
		},
		getTypes : function(){
			return $.get('getTypes');
		},
		getPets : function(){
			return $.get('getPets');
		},
		submitAdoptionApplication : function(data){
			return $.ajax('submitAdoptionApplication', {
			    method: "POST",
			    data: data,
			    processData: false,
			    contentType: false
			  });
		},
		getAdoptionApplications : function(){
			return $.get('secure/getAdoptionApplications?access_token=fool&token=' + this.token);
		}
	}

    return new services();
});