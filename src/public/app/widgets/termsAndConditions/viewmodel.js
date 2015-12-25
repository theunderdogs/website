define(function (require) {
	var vm = function(){
		var self = this;
	};

	vm.prototype = {
		activate : function(){

		},
		attached : function(view, parent){
			var self = this;    
		},
		compositionComplete : function(view, parent){
			this.view = view;
			this.openModal();
		},
		openModal : function(data, event){
			$(this.view).modal('show');
			return;
		},
		closeModal : function(data, event){
			$(this.view).modal('hide');
			return;
		}
	};

	return vm;
});