module.exports = {
	ADMIN : {
			   uiconfig : {
			   		showSidebar: true,
			        showNotificationIcon: true,
			        showTopMenu: false,
			        showLogout: true
			   },
			   routes : [
			   { route: '', title:'Welcome', moduleId: 'viewmodels/admin/dashboard', nav: true },
			   { route: 'addNewPet', title:'Add New Pet', moduleId: 'viewmodels/admin/addNewPet', nav: true },
			   { route: 'addNewUser', title:'Add New User', moduleId: 'viewmodels/admin/addNewUser', nav: true },
			   { route: 'pets', title:'Pets', moduleId: 'viewmodels/admin/pets', nav: true },
			   { route: 'applications', title:'Applications', moduleId: 'viewmodels/admin/applications', nav: true }]
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
	               { route: 'page2', moduleId: 'viewmodels/page2', title: 'Page 2', nav: true },
	               { route: 'admin', moduleId: 'viewmodels/admin/login', title: 'Admin', nav: true, loginUrl : '/app/views/admin/login.html' }]
        	}
}