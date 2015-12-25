define(['plugins/http', 'durandal/app', 'knockout', 'jquery', 'bootstrap'], function (http, app) {
   
	var storage = require('storage'),
		ko = require('knockout');

	var services = function(){
		var self = this;
		this.token = storage.local('userConfig') && storage.local('userConfig').token ? storage.local('userConfig').token : null;
		this.dataTypes = ko.observable();
	}

	services.prototype = {
		getUsers : function(){
			return $.get('secure/getUsers?access_token=fool&token=' + this.token);
		},
		getLogoutLink : function(){
			return 'logout?access_token=fool&token=' + this.token;
		},
		savePet : function(formData){
			return $.ajax('secure/savePet?access_token=fool&token=' + this.token, {
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
		},
		setStatusForApplication : function(formData){
			return $.ajax('secure/setStatusForApplication?access_token=fool&token=' + this.token, {
			    method: "POST",
			    data: formData,
			    processData: false,
			    contentType: false
			  });
		},getAboutUsHtml : function(){
			return $.get('getAboutUsHtml');
		},saveAboutUsHtml : function(formData){
			return $.ajax('secure/saveAboutUsHtml?access_token=fool&token=' + this.token, {
			    method: "POST",
			    data: formData,
			    processData: false,
			    contentType: false
			  });
		},
		saveNewVolunteer : function(data){
			return $.ajax('saveNewVolunteer', {
			    method: "POST",
			    data: data,
			    processData: false,
			    contentType: false
			  });
		},
		getVolunteers : function(){
			return $.get('secure/getVolunteers?access_token=fool&token=' + this.token);
		},
		getAdoptablePets : function(){
			return $.get('getAdoptablePets');
		},
		getEventLocation : function(){
			return $.get('getEventLocation');
		},
		saveEventLocation : function(data){
			return $.ajax('secure/saveEventLocation?access_token=fool&token=' + this.token, {
			    method: "POST",
			    data: data,
			    processData: false,
			    contentType: false
			  });
		},
		getNews : function(){
			return $.get('getNews');
		},
		saveNews : function(formData){
			return $.ajax('secure/saveNews?access_token=fool&token=' + this.token, {
			    method: "POST",
			    data: formData,
			    processData: false,
			    contentType: false
			  });
		},
		saveUser : function(formData){
			return $.ajax('secure/saveUser?access_token=fool&token=' + this.token, {
			    method: "POST",
			    data: formData,
			    processData: false,
			    contentType: false
			  });
		},
		getUserById : function(formData){
			return $.ajax('secure/getUserById?access_token=fool&token=' + this.token, {
			    method: "POST",
			    data: formData,
			    processData: false,
			    contentType: false
			  });
		},
		getPetById : function(formData){
			return $.ajax('secure/getPetById?access_token=fool&token=' + this.token, {
			    method: "POST",
			    data: formData,
			    processData: false,
			    contentType: false
			  });
		}
	}

    return new services();
});