// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
jwt = require('jsonwebtoken'),
fs = require('fs'),
User = mongoose.model('User'),
durandalRoutes = require("../routes/durandalRoutes.js"),
crypto = require('crypto');

module.exports = {

	getUsers : function(){
		return new Promise(function (resolve, reject) {
			User.find().populate('role').exec(function(err, users){
			 		if (err) {
			 			console.log(err);
			 			return reject(err);
			 		}
			 		
			 		return resolve(users);	
			 	});
		});
	},
	logout : function(user_token){
		return new Promise(function (resolve, reject) {
			if (user_token) {
				// verifies secret and checks exp
			    jwt.verify(user_token, 'publicsecret', function(err, decoded) {      
			      if (err) {
			         reject(err); //return res.send(403); //res.json({ success: false, message: 'Failed to authenticate token.' });    
			      } else {
			    	User.findOne({ username: decoded.username, isDisabled : false }, function(err, user){
			             if (!user) {
					     	//return Promise.resolve(403);
					     	reject(new Error("User not found"));
					     }else{
					     	 //console.log("found user: ", user);
					     
						     jwt.verify(decoded.user_token, user.secret, function(err, decoded_user_token) { 

						     	if (err) {
						     		reject(err);
						     	}
						     	else{
					        		if(decoded_user_token == user.username){
					        			//console.log("success");
					        			console.log("calling math random");
					        			user.secret = crypto.randomBytes(Math.ceil(12/2))
											        .toString('hex') // convert to hexadecimal format
											        .slice(0,12);

										user.save().then(function(savedUser){
											resolve(savedUser);
										}, function(err){
											reject(err);
										});

					        			//return Promise.resolve(200);
					        		}else{
					        			reject(new Error("Must be already logged out"));
					        			//return Promise.resolve(403);
					        		}
				        		}
						     });
					 	 }
					  }); 
			      }
			    });

			  } else {
			  	reject(new Error("Bad request, no user token found"));
				//return Promise.resolve(403);
			  }
		});
	},
	login : function(username, password){
		return new Promise(function (resolve, reject) {

			User.findOne({
			    username: username
			  }).populate('role')
  			.exec(function(err, user) {

			    if (err) {
			    	console.log(err);
			    	reject(err); //return err;//throw err;
			    }
			    else{
				    if (!user) {
				       reject(new Error('Authentication failed. User not found.'));
				       //return new Error('Authentication failed. User not found.');
				      //res.json({ success: false, message: 'Authentication failed. User not found.' });
				    } else if (user) {

				      // check if password matches
				      if (user.password != password) {
				        reject(new Error('Authentication failed. Wrong password.'));
				        //return new Error('Authentication failed. Wrong password.');
				        //res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				      } else {

				        // if user is found and password is right

			            var user_token = jwt.sign(user.username, 
				        	user.secret, {
				          	expiresInMinutes: 1440 // expires in 24 hours
				        });

				        // create a token
				        var token = jwt.sign({ username: user.username, 
				        	user_token: user_token }, 'publicsecret' , {
				          	expiresInMinutes: 1440 // expires in 24 hours
				        });

				        // return the information including token as JSON
				        resolve({
				          	USER_ROLE : user.role,
				          	user : {
				          		username : user.username,
				          		photo : user.photo
				          	},
				          	token : token,
				          	_durandalRoutes : durandalRoutes[user.role.code].routes,
				          	_uiconfig : durandalRoutes[user.role.code].uiconfig
				          });
				        // res.json({
				        //   success: true,
				        //   message: 'Enjoy your token!',
				        //   data: {
				        //   	USER_ROLE : user.role,
				        //   	token : token,
				        //   	_durandalRoutes : durandalRoutes[user.role].routes
				        //   }
				        // });
				      }   

				    }
				}
			  });

		});
	},

	saveNewUser : function(fields, files){
		
		var promiseArray = []
			,urlArray = []
			,targetPath = null
			,tempPath = null
			,fileName = null
			,thumbnailPromises = [];

		for(var i = 0; i < files.length; i++){

			promiseArray.push(new Promise(function(resolve, reject){

					if(files[i].headers['content-type'] != 'image/jpeg'){
						reject(new Error('Only images allowed.'));
					}else{
						//throw error
						tempPath = files[i].path;
						fileName = tempPath.split('\\')[tempPath.split('\\').length - 1];
						targetPath = __dirname + '\\..\\..\\public\\cdn\\protected' + '\\' + fileName + '.jpeg';

						thumbnailPromises.push(easyimg.thumbnail({src: targetPath, dst: targetPath.replace('cdn\\protected','cdn\\protected\\thumbnails'),
     width:40, height:40}));
						
						urlArray.push('cdn\\protected\\thumbnails' + '\\' + fileName + '.jpeg');
						
						fs.rename(tempPath, targetPath, function(err) {
				            if(err) {
				            	//throw err
				            	reject(new Error(err.message));
				            }else{
				            	console.log("Upload completed!");
				            	console.log(targetPath);
				            	resolve();
				        	}
				        });
					}
	
				})
			);
		}

		return Promise.all(promiseArray)
		.then(function(){
			return Promise.all(thumbnailPromises)
		})
		.then(function(){
			return newUser = new User({ 
					firstname: fields.firstname,
					lastname : fields.lastname, 
				    role: JSON.parse(fields.role), 
				    username: fields.username,
				    password : fields.password,
					phone : fields.phone,
					email : fields.email,
					photo : urlArray[0],
					secret : '12345',
					isDisabled : false
				}).save();
		})
		.then(function(){
			console.log('User saved successfully');
		})
		.catch(function(err){
			console.log(err);
			return reject(err);
		});
	}
}