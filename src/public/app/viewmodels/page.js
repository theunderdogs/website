/* requireJS inheritance
*http://blog.singuerinc.com/javascript/requirejs/2014/03/17/requirejs-and-javascript-inheritance/
*/

define(function (require) {
	
	var page = function (options) {
		if(!options) throw new Error('No options for page.js');

		this.headerTitle = ko.observable(options.headerTitle || 'headerTitle');
		this.smallHeaderTitle = ko.observable(options.smallHeaderTitle || 'smallHeaderTitle');
		this.breadCrumbs = ko.observableArray([
			{
				class1: 'fa fa-home',
				title: 'Home',
				class2: 'fa fa-angle-right'
			}, {
				title: 'Form Stuff',
				class2: 'fa fa-angle-right'
			}, {
				title: 'Form Layouts'
			}]);

		this.widgetCollection = [];
	};

	page.prototype = {
		getView : function(){
			return 'views/page.html';
		}
	}

	return page;
});