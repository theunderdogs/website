define(function(require) {
//define(function(require) {
   	//require('mapapi');

   	//var gmaps =require('gmaps');
   	var page = require('viewmodels/page'),
        services = require('services'),
        router = require('plugins/router');
    	
    var widget = function() {
    	this.calendarWidget = ko.observable({ kind : 'calendar' });
    	this.petGridWidget = ko.observable();
        this.gmapWidget = ko.observable();
    };

    widget.prototype = {
    	activate : function(settings){
            var self = this;

            var self= this,
            promises = [];

            promises.push(services.getAdoptablePets());
            promises.push(services.getEventLocation());

            return Promise.all(promises).then(function(result){
                    var petsToDisplay = [];
                    if(result[0].object.length > 4){

                        for(var i = 0; i < 4 ; i++)
                            petsToDisplay.push(result[0].object[i]); 
                    
                    }else{
                        petsToDisplay = result[0].object;
                    }

                    self.petGridWidget({ kind : 'petGrid', data: { petsToDisplay : petsToDisplay, showAdoptMe : true } });
                    
                    self.gmapWidget({ 
                                kind : 'gmap', 
                                data : { 
                                    markerText : '<b>Our next event is at: </b><br>' + result[1].object.location, 
                                    address : result[1].object.location }  
                            });
                });


            // return services.getEventLocation()
            //         .then(function(result){
            //             console.log(result.object);

            //             if(result.object){    
            //                 self.gmapWidget({ 
            //                     kind : 'gmap', 
            //                     data : { 
            //                         markerText : '<b>Our next event is at: </b><br>' + result.object.location, 
            //                         address : result.object.location }  
            //                 });
            //             }
            //         });
    	},
    	compositionComplete : function(view, parent){
    		//$(view).find("*").off();
		},
        viewAllPets : function(data, event){
            router.navigate('adoptablePets');
        }
    };
 
    return widget;
});