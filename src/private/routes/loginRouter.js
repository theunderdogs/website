var jwt = require('jsonwebtoken'),
    userLogic = require('../logic/userLogic.js');

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
				console.log('Error while logging in', result);
			    //forbidden
			    res.statusCode(403).send({ success  : false })
			});
		
		}else{
			//bad request
			res.statusCode(400).send({ success  : false })
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
}