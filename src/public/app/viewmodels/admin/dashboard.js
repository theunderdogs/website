define(function(require) {
	//var ko = require('knockout'),
    //	$ = require('jquery'),
    	//storage = require("storage");

    var services = require('services');
    var dashBoard = function(){
		this.users = null;
	};

	dashBoard.prototype = {
		getView: function(){
			return 'views/admin/dashboard.html';
		},
        activate : function(){
            var self = this;
            return  services.getUsers().then(function(result){
                self.users = result;
            }, function(err){
                throw new Error('Error while retrieving users' + err);
            });
        },
        logout : function(){
            window.location = services.getLogoutLink();
        },
		attached: function(view){
			$(view).find('.respose').html(this.users[0].firstname);
        }
	}

	return dashBoard;
});