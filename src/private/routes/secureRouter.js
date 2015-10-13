var userLogic = require('../logic/userLogic.js')
   ,multiparty = require('multiparty');
	
module.exports = function(router, passport){

	router.get('/getUsers', passport.authenticate('bearer', { session: false }), function(req, res){
		userLogic.getUsers().then(function(users){
			console.log(users);
			res.json(users);
		});	
	});

	router.post('/saveNewPet', passport.authenticate('bearer', { session: false }), function(req, res){
		
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files){
			res.statusCode = 200;
			res.end();
		});

		// userLogic.getUsers().then(function(users){
		// 	console.log(users);
		// 	res.json(users);
		// });	
	});
}