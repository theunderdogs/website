var userLogic = require('../logic/userLogic.js');
	
module.exports = function(router, passport){

	router.get('/getUsers', passport.authenticate('bearer', { session: false }), function(req, res){
		userLogic.getUsers().then(function(users){
			console.log(users);
			res.json(users);
		});	
	});

	
}