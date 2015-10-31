define(function(require) {
   	//require('mapapi');

   	var gmaps =require('gmaps');
   	require('gmapsjs');
   	var page = require('viewmodels/page');
    	
    var widget = function() {
    	this.calendarWidget = ko.observable({ kind : 'calendar' });
    };

    widget.prototype = {
    	activate : function(settings){

    	},
    	compositionComplete : function(view, parent){
		 //   var map = new GMaps({
			// 	div: '#map',
			// 	lat: -13.004333,
			// 	lng: -38.494333
			//   });

		 //   var marker = map.addMarker({
	  //           lat: -13.004333,
			// 	lng: -38.494333,
	  //           title: 'Loop, Inc.',
	  //           infoWindow: {
	  //               content: "<b>Loop, Inc.</b> 795 Park Ave, Suite 120<br>San Francisco, CA 94107"
	  //           }
	  //       });

			// marker.infoWindow.open(map, marker);	

			//var map = new gmaps.Map(myDiv, mapOpts);

		       var  geocoder = new google.maps.Geocoder(); 

		       var mapCanvas = document.getElementById('map');
		       
		       var mapOptions = {
		          center: new google.maps.LatLng(44.5403, -78.5463),
		          zoom: 8,
		          mapTypeId: google.maps.MapTypeId.ROADMAP
		        }
		        
		        var map = new google.maps.Map(mapCanvas, mapOptions);


		        var address = "26 w colcord ave, edmond, ok, 73003";
		        if (geocoder) {
					    geocoder.geocode({
					      'address': address
					    }, function(results, status) {
					      if (status == google.maps.GeocoderStatus.OK) {
					        if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
					          map.setCenter(results[0].geometry.location);

					          var infowindow = new google.maps.InfoWindow({
					            content: '<b>' + address + '</b>',
					            size: new google.maps.Size(150, 50)
					          });

					          var marker = new google.maps.Marker({
					            position: results[0].geometry.location,
					            map: map,
					            title: address
					          });
					          google.maps.event.addListener(marker, 'click', function() {
					            infowindow.open(map, marker);
					          });

					        } else {
					          alert("No results found");
					        }
					      } else {
					        alert("Geocode was not successful for the following reason: " + status);
					      }
					    });
					}

		}
		      
    	
    };
 
    return widget;
});