define(function(require) {
    var services = require('services'),
        uiconfig = require('classes/uiconfig');

    var wigdet = function() {
    	this.applications = ko.observableArray();
    };

    wigdet.prototype = {
    	activate : function(settings){
            var self = this;
            var promises = [];
            promises.push(services.getVolunteers());

            uiconfig.showLoading(true);
            return Promise.all(promises).then(function(result){
                if(result && result[0].object){
                    self.applications(result[0].object);
                }
                uiconfig.showLoading(false);
            });
    	},
        formatDate : function(_date){
            var date =  new Date(_date);
            return date.getMonth() + '/' +  date.getDate() + '/' + date.getYear();
        }
    };

    return wigdet;
});