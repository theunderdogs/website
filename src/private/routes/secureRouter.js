var userLogic = require('../logic/userLogic.js')
   ,petLogic = require('../logic/petLogic.js')
   ,adoptorLogic = require('../logic/adoptorLogic.js')
   ,rules = require('../logic/rules.js')
   ,middleware = require('../logic/middleware.js')
   ,multiparty = require('multiparty')
   ,fs = require('fs')
   ,Promise = require('promise/lib/es6-extensions');

module.exports = function(router, passport){

	router.get('/getUsers', passport.authenticate('bearer', { session: false }), function(req, res){
		userLogic.getUsers().then(function(users){
			console.log(users);
			res.statusCode = 200;
			res.json({ success  : true, message: '', object: users });
			res.end();
		})
		.catch(function(err){
			res.statusCode = 500;
			res.json({ success  : false, message: 'getUsers failed' });
			res.end();	
		});	
	});

	router.post('/saveNewPet', passport.authenticate('bearer', { session: false }), middleware.hasPermission(rules.saveNewPet), function(req, res){
		
		var form = new multiparty.Form(),
			user = req.appData.user;

		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			petLogic.saveNewPet(JSON.parse(fields.data), user, files.filesToBeUploaded)			
			.then(function(result){
				res.statusCode = 200;
				res.json({ success  : true, message: 'Pet saved successfully', object: result });
				res.end();	
			})
			.catch(function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while uploading files' });
				res.end();	
			});
		});
	});

	router.get('/getAdoptionApplications', passport.authenticate('bearer', { session: false }), function(req, res){
		adoptorLogic.getAdoptionApplications().then(function(users){
			console.log(users);
			res.statusCode = 200;
			res.json({ success  : true, message: '', object: users });
			res.end();
		})
		.catch(function(err){
			res.statusCode = 500;
			res.json({ success  : false, message: 'getAdoptionApplications failed' });
			res.end();	
		});	
	});
}