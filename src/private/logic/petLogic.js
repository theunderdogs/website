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
			,thumbnailPromises = [];

		for(var i = 0; i < files.length; i++){

			promiseArray.push(new Promise(function(resolve, reject){

					if(files[i].headers['content-type'] != 'image/jpeg'){
						reject(new Error('Only images allowed.'));
					}else{
						//throw error
						tempPath = files[i].path;
						targetPath = __dirname + '/../../public/cdn/protected' + '\\' + i + '.jpeg';

						fs.rename(tempPath, targetPath, function(err) {
				            if(err) {
				            	//throw err
				            	reject(new Error(err.message));
				            }else{
				            	console.log("Upload completed!");
				            	urlArray.push(targetPath);
				            	console.log(targetPath);
				            	thumbnailPromises.push(easyimg.thumbnail({src: targetPath, dst: targetPath.replace('cdn/protected','cdn/protected/thumbnails'),
     width:300, height:169}));

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
				    status : JSON.parse(fields.status), 
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
	}
}