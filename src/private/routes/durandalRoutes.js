module.exports = {
	ADMIN : {
			   routes : [{ route: '', title:'Welcome', moduleId: 'viewmodels/admin/dashboard', nav: true }]
            
            },
	ANON : {
			   routes : [
	               { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
	               { route: 'page2', moduleId: 'viewmodels/page2', title: 'Page 2', nav: true },
	               { route: 'admin', moduleId: 'viewmodels/admin/login', title: 'Admin', nav: true, loginUrl : '/app/views/admin/login.html' }]
        	}
}