module.exports = {
	ADMIN : {
			   uiconfig : {
			   		showSidebar: true,
			        showNotificationIcon: true,
			        showTopMenu: false,
			        showLogout: true
			   },
			   routes : [
			   { route: '', title:'Welcome', moduleId: 'viewmodels/admin/dashboard', nav: true, css : 'icon-home' },
			   { route: 'addNewPet', title:'Add New Pet', moduleId: 'viewmodels/admin/addNewPet', nav: true, css : 'icon-plus' },
			   //{ route: 'addNewUser', title:'Add New User', moduleId: 'viewmodels/admin/addNewUser', nav: true },
			   { route: 'pets', title:'Pets', moduleId: 'viewmodels/admin/pets', nav: true, css : 'icon-pin' },
			   { route: 'applications', title:'Adoption applications', moduleId: 'viewmodels/admin/applications', nav: true, css : 'icon-docs' },
			   { route: 'volunteers', title:'Volunteer applications', moduleId: 'viewmodels/admin/volunteers', nav: true, css : 'icon-paper-clip' },
			   { route: 'editaboutus', title:'Edit \'About Us\'', moduleId: 'viewmodels/admin/editaboutus', nav: true, css : 'icon-user' }]
            },
	ANON : {
			   uiconfig : {
			   		showSidebar: null,
			        showNotificationIcon: false,
			        showTopMenu: true,
			        showLogout: false
			   },
			   routes : [
	               { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
	               { route: 'volunteer', title:'Volunteer', moduleId: 'viewmodels/volunteer', nav: true },
	               { route: 'aboutus', moduleId: 'viewmodels/aboutus', title: 'About Us', nav: true },
	               { route: 'admin', moduleId: 'viewmodels/admin/login', title: 'Admin', loginUrl : '/app/views/admin/login.html' }]
        	}
}