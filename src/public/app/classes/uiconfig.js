define(function(require) {
    //var ko = require('knockout'),
    //	$ = require('jquery');

    var showSidebar = ko.observable(),
        router = require('plugins/router');

    showSidebar.subscribe(function(newValue){
            if(newValue){
                $('body').removeClass('page-sidebar-closed, page-sidebar-dissapear');
            }else{
                $('body').removeClass('page-sidebar-closed').addClass('page-sidebar-dissapear');
            }
        });

    var loadingCounter = 0;
    var showLoading = ko.observable(false);

    showLoading.subscribe(function(newValue){
            if(newValue){
                loadingCounter++;
                console.log('loadingCounter true ', loadingCounter);
                //show
                $('#loadingScreen').css("display", "block");
            }else{
                loadingCounter--;
                console.log('loadingCounter false ', loadingCounter);
                if(loadingCounter == 0){
                    //hide
                    $('#loadingScreen').css("display", "none");
                }
            }
        });

    return {
        showSidebar: showSidebar,
        showNotificationIcon: ko.observable(false),
        showTopMenu: ko.observable(false),
        showLogout: ko.observable(false),
        showLoading: showLoading,
        captchaKey: '6Lf3bhMTAAAAAPrzTxDV4IH6iN7fl1-gRBtuSafk',
        rebuildRouter : function(routeArray){
                router.deactivate();
                router.reset();
                router.routes = [];
                router.map(routeArray).buildNavigationModel();
                return router.activate({pushState : false});
        },
        getCanvasFromImage : function(url){
            var image = new Image();

            // create an empty canvas element
            var canvas = document.createElement("canvas"),
            canvasContext = canvas.getContext("2d");

            var imgPromise = new Promise(function(resolve, reject){
                image.onload = function () {
                
                    //Set canvas size is same as the picture
                    canvas.width = image.width;
                    canvas.height = image.height;
                 
                    // draw image into canvas element
                    canvasContext.drawImage(image, 0, 0, image.width, image.height);
                 
                    // get canvas contents as a data URL (returns png format by default)
                    //var dataURL = canvas.toDataURL();

                    //console.log('jang', dataURL);

                    resolve(canvas);
                };

                image.src = url;
            });
            
            return imgPromise;
        }
    };
});