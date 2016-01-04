define(function(require) {
	'use strict';

    require("fullcalendar")
    require("googlecalendar");

    var CalendarWidget = function() {
        this.view;
    };

    var proto = CalendarWidget.prototype;
    
    proto.activate  = function(settings) {
        this.settings = settings;
    };

    proto.compositionComplete = function(view, calendar) {
        this.view = view;

        $(view).fullCalendar(
             {
                 googleCalendarApiKey: 'AIzaSyBhCHsSiB-YlfHtWp77HW2NvDUK83GRjlI',
                 events: 'majuqvemcl0nn28d7k6re633ms@group.calendar.google.com',
                    eventClick: function(event) {
                    // opens events in a popup window
                    window.open(event.url, 'gcalevent', 'width=700,height=600');
                    return false;
                },
                header: {
                    //right:  'month,agendaWeek,agendaDay, prev,next',
                    right:  'prev,next',
                    
                 },
                views: {
                    month: { // name of view
                        //titleFormat: "[Events in ]" + 'MMMM YYYY'
                        titleFormat: 'MMM YYYY'
                        // other view-specific options here
                    },
                    //agendaWeek : {
                        //titleFormat: "[Events in ]" + 'MMM D YYYY'
                   //     titleFormat: 'MMM D YYYY'
                   // },
                    agendaDay : {
                        //titleFormat: "[Events in ]" + 'MMMM D YYYY'
                        titleFormat: 'MMM D YYYY'
                    }
                }
             }
        );  
    };

    return CalendarWidget;
});