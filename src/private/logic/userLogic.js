// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
jwt = require('jsonwebtoken'),
fs = require('fs'),
User = mongoose.model('User'),
durandalRoutes = require('../routes/durandalRoutes.js'),
customError = require('../logic/customError.js'),
errorMetaData = require('../logic/ErrorMetaData.js');
easyimg = require('easyimage'),
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
	getUserById : function(fields){
		return User.findById(fields.id).populate('role').exec()
				.then(function(user){
					return user;
				}, function(err){
					return err
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
			    username: username,
			    isDisabled : false
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

	saveUser : function(fields, files){
		
		var userExistsPromise = new Promise(function(resolve, reject){
			if(!fields.id){
				//check if user exists
				User.findOne({ username: fields.username })
		  			.then(function(user) {
		  				if(user){
		  					reject();
		  				}else{
		  					resolve();
		  				}
		  			}, function(err){
		  				reject(err);
		  			});
	  		}else{
	  			resolve();
	  		}
		});

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
						fileName = jwt.sign(tempPath, 
				        	'1', {
				          	expiresInMinutes: 1000 // expires in 24 hours
				        });

				        targetPath = __dirname + '/../../public/cdn/protected/' + fileName + '.jpeg';

				        thumbnailPromises.push(easyimg.thumbnail({src: tempPath, dst: targetPath.replace('cdn/protected','cdn/protected/thumbnails'),
     width:40, height:40}));

						thumbnailPromises.push(easyimg.thumbnail({src: tempPath, dst: targetPath.replace('cdn/protected','cdn/protected/thumbnails/300'),
     width:300, height:169}));

						thumbnailPromises.push(easyimg.thumbnail({src: tempPath, dst: targetPath, width:800, height:450}));
						
						urlArray.push('cdn/protected/thumbnails/' + fileName + '.jpeg');
						
						// fs.rename(tempPath, targetPath, function(err) {
				  //           if(err) {
				  //           	//throw err
				  //           	reject(err);
				  //           	//return err;
				  //           }else{
				  //           	console.log("Upload completed!");
				  //           	console.log(targetPath);
				  //           	resolve();
				  //       	}
				  //       });

							resolve();
					}
	
				})
			);
		}

		return userExistsPromise.then(function(){
			return Promise.all(promiseArray, function(){
				return 'Image upload Failed';
			})
		}, function(err){
			//user exixts
			throw new customError(errorMetaData.USER_EXISTS);
		})
		.then(function(){
			return Promise.all(thumbnailPromises, function(err){
				//thmbnails conversion failed
				throw new customError(errorMetaData.THUMBNAIL_CREATION_FAILED);
			});
		})
		.then(function(){
			var toBeSaved = { 
					firstname: fields.firstname,
					lastname : fields.lastname, 
				    role: JSON.parse(fields.role), 
				    password : fields.password,
					phone : fields.phone,
					email : fields.email,
					photo : urlArray[0],
					secret : '12345',
					isDisabled : fields.isDisabled
				};

			if(fields.id){
				return User.findOneAndUpdate({ _id: fields.id }, toBeSaved)
	  			.exec()
	  			.then(function(updatedUser){
	  				return updatedUser;
	  			}, function(err){
	  				//return new Error(err.message);
	  				throw new customError(errorMetaData.FAILED_TO_UPDATE_USER);
	  			});
	  		}
			else {
				toBeSaved.username = fields.username;

				return new User(toBeSaved).save()
				.then(function(newUser){
					return newUser;
				}, function(err){
					throw new customError(errorMetaData.FAILED_TO_SAVE_USER);
				});
			}
		})
		// .catch(function(err){
		// 	return err;
		// });
	}
}