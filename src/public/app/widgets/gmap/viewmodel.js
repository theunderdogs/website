define(function(require) {
	'use strict';
  
    require('gmapsjs');
    
    var gmapWidget = function() {
        this.view;
    };

    var proto = gmapWidget.prototype;
    
    proto.activate  = function(settings) {
        this.settings = settings;
    };

    proto.compositionComplete = function(view, parent) {
        var self = this;
        this.view = view;

        var map, marker;

        GMaps.geocode({
          address: self.settings.data.address,
          callback: function(results, status) {
            if (status == 'OK') {
              var latlng = results[0].geometry.location;

                  map = new GMaps({
                    div: $(view)[0],
                    lat: latlng.lat(),
                    lng: latlng.lng()
                  });

                  map.setCenter(latlng.lat(), latlng.lng());
                  marker = map.addMarker({
                    lat: latlng.lat(),
                    lng: latlng.lng(),
                    title: self.settings.data.address,
                    infoWindow: {
                        content:  self.settings.data.markerText
                    }
                  });

                  marker.infoWindow.open(map, marker);  
            }
          }
        });
    };

    return gmapWidget;
});