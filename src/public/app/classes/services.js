define(['plugins/http', 'durandal/app', 'knockout', 'jquery', 'bootstrap'], function (http, app) {
   
	var services = function(){
		var self = this;
		this.token = storage.local('userConfig').token;
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
		}
	}

    return new services();
});