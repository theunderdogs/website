define(function (require) {
	require("ckeditor");

    var services = require('services'),
    	_ = require("lodash");

    var widget = function(){
    	this.view;
    	this.aboutUsHtml = ko.observable();
    };

    widget.prototype = {
    	activate : function(settings){
    		var self = this;

    		return services.getAboutUsHtml().then(function(result){
    			if(result.object){
    				self.aboutUsHtml(result.object.html);
    			}
    		});
    	},
    	compositionComplete : function(view, parent){
    		this.view = view;
    		CKEDITOR.replace( $(this.view).find('.ckeditor').attr('name') );

    		CKEDITOR.instances.editor1.setData( this.aboutUsHtml(), {
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
    	cancel : function(data, event){
    		router.navigate('');
    	} 
    };

    return widget;
});