var userLogic = require('../logic/userLogic.js')
   ,petLogic = require('../logic/petLogic.js')
   ,adoptorLogic = require('../logic/adoptorLogic.js')
   ,generalLogic = require('../logic/generalLogic.js')
   ,userLogic = require('../logic/userLogic.js')
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

	router.post('/savePet', passport.authenticate('bearer', { session: false }), middleware.hasPermission(rules.saveNewPet), function(req, res){
		
		var form = new multiparty.Form(),
			user = req.appData.user;

		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			petLogic.savePet(JSON.parse(fields.data), user, files.filesToBeUploaded)			
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

	router.post('/setStatusForApplication', passport.authenticate('bearer', { session: false }), function(req, res){
		
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			adoptorLogic.setStatusForApplication(JSON.parse(fields.data))			
			.then(function(result){
				res.statusCode = 200;
				res.json({ success  : true, message: 'Status updated successfully', object: result });
				res.end();	
			})
			.catch(function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while updating status' });
				res.end();	
			});
		});
	});

	router.post('/saveAboutUsHtml', passport.authenticate('bearer', { session: false }), function(req, res){
		
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			generalLogic.saveAboutUsHtml(JSON.parse(fields.data))			
			.then(function(result){
				res.statusCode = 200;
				res.json({ success  : true, message: 'Status updated successfully', object: result });
				res.end();	
			})
			.catch(function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while updating status' });
				res.end();	
			});
		});
	});

	router.get('/getVolunteers', passport.authenticate('bearer', { session: false }), function(req, res){
		generalLogic.getVolunteers().then(function(volunteers){
			console.log(volunteers);
			res.statusCode = 200;
			res.json({ success  : true, message: '', object: volunteers });
			res.end();
		})
		.catch(function(err){
			res.statusCode = 500;
			res.json({ success  : false, message: 'getVolunteers failed' });
			res.end();	
		});	
	});

	router.post('/saveEventLocation', passport.authenticate('bearer', { session: false }), function(req, res){
		
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			generalLogic.saveEventLocation(JSON.parse(fields.data))			
			.then(function(result){
				res.statusCode = 200;
				res.json({ success  : true, message: 'Location updated successfully', object: result });
				res.end();	
			})
			.catch(function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while updating location' });
				res.end();	
			});
		});
	});

	router.post('/saveNews', passport.authenticate('bearer', { session: false }), function(req, res){
		
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			generalLogic.saveNews(JSON.parse(fields.data))			
			.then(function(result){
				res.statusCode = 200;
				res.json({ success  : true, message: 'News updated successfully', object: result });
				res.end();	
			})
			.catch(function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while updating news' });
				res.end();	
			});
		});
	});

	router.post('/saveUser', passport.authenticate('bearer', { session: false }),

		function(req, res, next){

			var userid = req.appData.user.id,
			form = new multiparty.Form();

			form.parse(req, function(err, fields, files){
				if(err){
					res.statusCode = 500;
					res.json({ success  : false, message: 'Something went wrong' });
					res.end();
				}

				req._fields = fields;
				req._files = files;

				if(!JSON.parse(fields.data).id){
					middleware.hasPermission(rules.canAddUser)(req, res, next);
				}
				else if(JSON.parse(fields.data).id != userid)
				{
					middleware.hasPermission(rules.canAddUser)(req, res, next);	
				}else{
					next();
				}
			});

		}
		, function(req, res){

		//form.parse(req, function(err, fields, files){

			//es6 promise
			userLogic.saveUser(JSON.parse(req._fields.data), req._files.filesToBeUploaded)			
			.then(function(result){
				res.statusCode = 200;
				res.json({ success  : true, message: 'User saved successfully', object: result });
				res.end();	
			})
			.catch(function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: err.message });
				res.end();	
			});
		//});
	});

	router.post('/getUserById', passport.authenticate('bearer', { session: false }), function(req, res){
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			//nodeJS promise
			userLogic.getUserById(JSON.parse(fields.data))			
			.then(function(user){
				res.statusCode = 200;
				res.json({ success  : true, message: 'User fetched successfully', object: user });
				res.end();	
			}, function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while fetching user' });
				res.end();	
			});
		});
	});

	router.post('/getPetById', passport.authenticate('bearer', { session: false }), function(req, res){
		var form = new multiparty.Form();

		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			//nodeJS promise
			petLogic.getPetById(JSON.parse(fields.data))			
			.then(function(pet){
				res.statusCode = 200;
				res.json({ success  : true, message: 'Pet fetched successfully', object: pet });
				res.end();	
			}, function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while fetching pet' });
				res.end();	
			});
		});
	});
}