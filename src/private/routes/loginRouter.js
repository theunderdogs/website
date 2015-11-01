var jwt = require('jsonwebtoken'),
	userLogic = require('../logic/userLogic.js'),
    generalLogic = require('../logic/generalLogic.js'),
    petLogic = require('../logic/petLogic.js'),
    adoptorLogic = require('../logic/adoptorLogic.js'),
    multiparty = require('multiparty');

module.exports = function(router, passport) {
	//app.use(passport.initialize());

	router.get('/login', function(req, res){
		console.info('login get');
		// res.statusCode = 200; 
	 //    res.setHeader("Location", "/app/views/admin/login.html");
	 //    res.end();
	 	
	 	res.redirect("/app/views/admin/login.html");
	});

	//recevies credentials 
	router.post('/login', function(req, res){
		console.log("login....");

		if(req.body.username && req.body.password)
		{
			userLogic.login(req.body.username, req.body.password)
			.then(function(result){
				res.json({
		          success: true,
		          message: 'Enjoy your token!',
		          data: result
		        });
			})
			.catch(function(err){
				console.log('Error while logging in', err);
			    //forbidden
			    //res.statusCode(403).send({ success  : false })
			    res.statusCode = 403;
			    res.json({ success  : false, message: err.message });
				res.end();
			});
		}else{
			//bad request
			//res.statusCode(400).send({ success  : false })
			res.statusCode = 400;
			res.json({ success  : false, message: 'Bad Request' });
			res.end();
		}  	
	});
  
	router.get('/logout', function(req, res){

	    console.info('logging out..');

		var user_token = req.headers['x-access-token'] || req.body.token || req.query.token;

		userLogic.logout(user_token)
		.then(function(result){
			console.log("logout then", result.secret);
			//res.logout(); 
			res.redirect("/app/views/admin/login.html");  
		})
		.catch(function(err){
			console.log("logout catch");
			console.log(err);
			//res.logout(); 
			res.redirect("/app/views/admin/login.html");	
		});
		  
	});

	router.get('/getTypes', function(req, res){
		generalLogic.getTypes().then(function(dataTypes){
			console.log(dataTypes);
			res.statusCode = 200;
			res.json({ success  : true, message: '', object: dataTypes });
			res.end();
		})
		.catch(function(err){
			res.statusCode = 500;
			res.json({ success  : false, message: 'getTypes failed' });
			res.end();	
		});	
	});

	router.get('/getPets', function(req, res){
		petLogic.getPets().then(function(pets){
			console.log(pets);
			res.statusCode = 200;
			res.json({ success  : true, message: '', object: pets });
			res.end();	
		})
		.catch(function(err){
			res.statusCode = 500;
			res.json({ success  : false, message: 'getTypes failed' });
			res.end();	
		});	
	});

	router.post('/submitAdoptionApplication', function(req, res){
		var form = new multiparty.Form();
		
		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			adoptorLogic.submitAdoptionApplication(JSON.parse(fields.data))			
			.then(function(result){
				res.statusCode = 200;
				res.json({ success  : true, message: 'Application submitted successfully', object: result });
				res.end();	
			})
			.catch(function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while submitting application' });
				res.end();	
			});
		});
	});

	router.get('/getAboutUsHtml', function(req, res){
		generalLogic.getAboutUsHtml().then(function(result){
			//console.log(pets);
			res.statusCode = 200;
			res.json({ success  : true, message: '', object: result });
			res.end();	
		})
		.catch(function(err){
			res.statusCode = 500;
			res.json({ success  : false, message: 'about us html failed' });
			res.end();	
		});	
	});

	router.post('/saveNewVolunteer', function(req, res){
		var form = new multiparty.Form();
		
		form.parse(req, function(err, fields, files){
			
			if(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong' });
				res.end();
			}

			generalLogic.saveNewVolunteer(JSON.parse(fields.data))			
			.then(function(result){
				res.statusCode = 200;
				res.json({ success  : true, message: 'Application submitted successfully', object: result });
				res.end();	
			})
			.catch(function(err){
				res.statusCode = 500;
				res.json({ success  : false, message: 'Something went wrong while submitting application' });
				res.end();	
			});
		});
	});

	router.get('/getAdoptablePets', function(req, res){
		petLogic.getAdoptablePets().then(function(pets){
			console.log(pets);
			res.statusCode = 200;
			res.json({ success  : true, message: '', object: pets });
			res.end();	
		})
		.catch(function(err){
			res.statusCode = 500;
			res.json({ success  : false, message: 'getAdoptablePets failed' });
			res.end();	
		});	
	});

	router.get('/getEventLocation', function(req, res){
		generalLogic.getEventLocation().then(function(result){
			//console.log(pets);
			res.statusCode = 200;
			res.json({ success  : true, message: '', object: result });
			res.end();	
		})
		.catch(function(err){
			res.statusCode = 500;
			res.json({ success  : false, message: 'event location failed' });
			res.end();	
		});	
	});
}