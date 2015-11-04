define(function (require) {
	require("ckeditor");

    var services = require('services'),
    	_ = require("lodash");

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

			services.saveAboutUsHtml(formData).then(function(result){
            	console.log(result);
            	alert('success***********');
            }, function(err){
                throw new Error('Error saving html', err);
            });
    	},
        saveAddress : function(data, event){
            var formData = new FormData();
            
            formData.append('data', JSON.stringify({ 
                                        location : ko.unwrap(this.eventAddress())
                                    } ));

            services.saveEventLocation(formData).then(function(result){
                console.log(result);
                alert('success***********');
            }, function(err){
                throw new Error('Error saving address', err);
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

            services.saveNews(formData).then(function(result){
                console.log(result);
                alert('success***********');
            }, function(err){
                throw new Error('Error saving html', err);
            });
        } 
    };

    return widget;
});