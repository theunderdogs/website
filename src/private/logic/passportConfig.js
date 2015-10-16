var mongoose = require('mongoose')
	,bearerStrategy = require('passport-http-bearer').Strategy
	,jwt = require('jsonwebtoken');
	//,util = require( "util" )
	//,appError = require( "./app-error" ).createAppError;

//http://localhost:44085/secure/getUsers?access_token=fool&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImtpcmFuZGVvcmUiLCJ1c2VyX3Rva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSjkuYTJseVlXNWtaVzl5WlEuZ3ZoUEc4MlVCYURnU3ByNVVvVFVpWDJKcnAxX1NXSS1mazNuMlNvNTE2OCIsImlhdCI6MTQ0MjAzNzM5MywiZXhwIjoxNDQyMTIzNzkzfQ.tYv5Z3n3Td-pviirdNq3rdgqC34mnxqon-i8f1ETuDQ

module.exports = function(passport, app){
		app.use(passport.initialize());
	//app.use(passport.session());

	passport.serializeUser(function(user, done){
		done(user.id);
	});

	passport.deserializeUser(function(id, done){
		//query db here
		done({ id: id, username : id });
	});

	//http://localhost:44085/secure/getUsers?access_token=sdasd&token=eyJhbGciOiJIUzI1NiJ9.a2lyYW5kZW9yZQ.gvhPG82UBaDgSpr5UoTUiX2Jrp1_SWI-fk3n2So5168
	//token bearer strategy
	passport.use(new bearerStrategy({passReqToCallback: true},
	function(req, token, done) { 
       
		if(token != 'fool'){ //?access_token=
			done(new Error('you are a fool'));
		}
	  // insert your MongoDB check here. For now, just a simple hardcoded check.
	  //console.log("im herer", token);
	  //console.log("x-access-token", req.headers['x-access-token']);
	  
	  var user_token = req.headers['x-access-token'] || req.body.token || req.query.token;

	  //console.log("user_token ", user_token);

	  if (user_token) {

	    // verifies secret and checks exp
	    jwt.verify(user_token, 'publicsecret', function(err, decoded) {      
	      if (err) {
	      	console.log(err);
	        //return done(new Error("Failed to authenticate token."));
	        done({ success: false, message: 'Failed to authenticate public token.' }); 
	        //res.json({ success: false, message: 'Failed to authenticate token.' });
	      } else {
	        // if everything is good, save to request for use in other routes
	        //console.log("decoded", decoded);

	        //{ username: user.username, user_token: user_token }
	        
	        mongoose.model('User').findOne({ username: decoded.username }, function(err, user){
			     if (!user) return done(new Error("user not found for token."));
			     //console.log("found user: ", user);
			     
			     jwt.verify(decoded.user_token, user.secret, function(err, decoded_user_token) { 

			     	if (err) {
	        			//return done(new Error("Close enough."));
	        			return done({ success: false, message: 'Failed to private authenticate token.' }); 
	        		}

	        		//console.log('decoded_user_token', decoded_user_token);

	        		if(decoded_user_token == user.username){
	        			//console.log("success");
	        			req.appData = {};
	        			req.appData.user = user;
	        			done(null, user.username, { scope: 'all' });
	        		}else{
	        			//return done(new Error("very close."));
	        			done({ success: false, message: 'very close'}); 
	        		}
			     });
			  }); 
	      }
	    });

	  } else {
	    done({ success: false, message: 'No token provided.' }); 
	  }

	})); /*passport end*/
}