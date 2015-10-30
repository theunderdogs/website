var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
User = mongoose.model('User'),
fs = require('fs')
Animal = mongoose.model('Animal'),
easyimg = require('easyimage');

module.exports = {

	saveNewPet : function(fields, user, files){
		
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
						targetPath = __dirname + '\\..\\..\\public\\cdn\\pets' + '\\' + fileName + '.jpeg';

						thumbnailPromises.push(easyimg.thumbnail({src: targetPath, dst: targetPath.replace('cdn\\pets','cdn\\pets\\thumbnails'),
     width:300, height:169}));
						
						fs.rename(tempPath, targetPath, function(err) {
				            if(err) {
				            	//throw err
				            	reject(new Error(err.message));
				            }else{
				            	console.log("Upload completed!");
				            	urlArray.push(targetPath);
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
			return new Promise(function(resolve, reject){
				var newPet = new Animal({ 
					name: fields.name,
					gender : JSON.parse(fields.gender), 
				    kind: JSON.parse(fields.kind), 
				    specifyKind: fields.specifyKind,
				    breed : fields.breed,
					color : fields.color,
					weight : fields.weight,
					dateFound : fields.dateFound,
					age : fields.age,	
					bio : fields.bio,			  
				    //status : JSON.parse(fields.status), 
				    notes : fields.notes, 
					photoUrls: urlArray, 
					user: user
				}).save(function(err) {
				    if (err) {
				    	//throw err;
				    	return reject(err);
				    }else{
				    	console.log('Animal saved successfully');
				    	return resolve();	
				    }
				 });
			});
		})
		.catch(function(err){
			console.log(err);
			return reject(err);
		});
	},

	getPets : function(){
		return new Promise(function (resolve, reject) {
			Animal.find(function(err, pets){
			 		if (err) {
			 			console.log(err);
			 			reject(err);
			 		}
			 		else{
			 			resolve(pets);
			 		}	
			 	});
		});
	}
}