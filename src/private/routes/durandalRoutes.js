module.exports = {
	ADMIN : {
			   uiconfig : {
			   		showSidebar: true,
			        showNotificationIcon: true,
			        showTopMenu: false,
			        showLogout: true
			   },
			   routes : [{ route: '', title:'Welcome', moduleId: 'viewmodels/admin/dashboard', nav: true }]
            
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