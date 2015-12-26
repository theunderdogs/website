define(function (require) {
	require("ckeditor");

    var services = require('services'),
    	_ = require("lodash"),
        uiconfig = require('classes/uiconfig'),
        toastr = require('toastr');

    var widget = function(){
    	this.view;
    	this.aboutUsHtml = ko.observable();
        this.newsHtml = ko.observable();
        this.eventAddress = ko.observable();
    };

    widget.prototype = {
    	activate : function(settings){
    		var self = this;
            var promises = [];

            promises.push(services.getAboutUsHtml());
            promises.push(services.getNews());
            promises.push(services.getEventLocation());

            uiconfig.showLoading(true);
    		return Promise.all(promises).then(function(result){
    			if(result[0].object){
    				self.aboutUsHtml(result[0].object.html);
    			}
                if(result[1].object){
                    self.newsHtml(result[1].object.html);
                }

                if(result[2].object){
                    self.eventAddress(result[2].object.location);
                }

                uiconfig.showLoading(false);
    		});
    	},
    	compositionComplete : function(view, parent){
    		this.view = view;
    		CKEDITOR.replace( 'editor1' );
            CKEDITOR.replace( 'editor2' );

    		CKEDITOR.instances.editor1.setData( this.aboutUsHtml(), {
			    callback: function() {
			        
			    }
			} );

            CKEDITOR.instances.editor2.setData( this.newsHtml(), {
                callback: function() {
                    
                }
            } );
    	},
    	save : function(data, event){
    		var formData = new FormData();
    		
    		formData.append('data', JSON.stringify({ 
    									html : CKEDITOR.instances.editor1.getData()
    								} ));

            uiconfig.showLoading(true);
			services.saveAboutUsHtml(formData).then(function(result){
            	uiconfig.showLoading(false);
                console.log(result);
            	toastr.success('\'About us\' has been updated', 'Updated Successfully', {timeOut: 5000});

            }, function(err){
                uiconfig.showLoading(false);
                toastr.error('Something went wrong while updating \'About us\'', 'Oops!', {timeOut: 5000});
            });
    	},
        saveAddress : function(data, event){
            var formData = new FormData();
            
            formData.append('data', JSON.stringify({ 
                                        location : ko.unwrap(this.eventAddress())
                                    } ));

            uiconfig.showLoading(true);
            services.saveEventLocation(formData).then(function(result){
                uiconfig.showLoading(false);
                console.log(result);
                toastr.success('\'Event location\' has been updated', 'Updated Successfully', {timeOut: 5000});
            }, function(err){
                uiconfig.showLoading(false);
                toastr.error('Something went wrong while updating \'Event location\'', 'Oops!', {timeOut: 5000});
            });
        },
    	cancel : function(data, event){
    		router.navigate('');
    	},
        saveNews : function(data, event){
            var formData = new FormData();
            
            formData.append('data', JSON.stringify({ 
                                        html : CKEDITOR.instances.editor2.getData()
                                    } ));

            uiconfig.showLoading(true);
            services.saveNews(formData).then(function(result){
                uiconfig.showLoading(false);
                console.log(result);
                toastr.success('\'News\' has been updated', 'Updated Successfully', {timeOut: 5000});
            }, function(err){
                uiconfig.showLoading(false);
                toastr.error('Something went wrong while updating \'News\'', 'Oops!', {timeOut: 5000});
            });
        } 
    };

    return widget;
});