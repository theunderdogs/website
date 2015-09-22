define(function(require) {
	var ko = require('knockout'),
    	$ = require('jquery'),
    	storage = require("storage");

	var dashBoard = function(){
		this.token = null;
        
        if(storage.local("userConfig") && storage.local("userConfig").USER_ROLE){
            if(storage.local("userConfig").USER_ROLE == 'ADMIN'){
                this.token = storage.local("userConfig").token;          
            }
        }

		this.getUsers = function(){
            return $.get("secure/getUsers?access_token=fool&token=" + this.token);
        }
	};

	dashBoard.prototype = {
		getView: function(){
			return 'views/admin/dashboard.html';
		},
		attached: function(view){
			var self= this;
            this.getUsers()
            .then(function(result){
                $(view).find('.respose').html(result[0].firstname);
                $(view).find('.logout').attr('href', 'logout?access_token=fool&token=' + self.token);
            }, function(err){
                $(view).find('.respose').html(err);
            })
        }
	}

	return dashBoard;
});