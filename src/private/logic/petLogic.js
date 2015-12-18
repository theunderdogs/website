var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
User = mongoose.model('User'),
fs = require('fs')
Animal = mongoose.model('Animal'),
easyimg = require('easyimage'),
adoptorLogic = require('../logic/adoptorLogic.js');

module.exports = {

	savePet : function(fields, user, files){
		
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
						
						urlArray.push('cdn\\pets\\thumbnails' + '\\' + fileName + '.jpeg');
						
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

				var toBeSaved = { 
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
				};


			if(fields.id)
				return Animal.findOneAndUpdate({ _id: fields.id }, toBeSaved)
	  			.exec(function(err, updatedPet) {
	  				if(err){
	  					console.log(err);
	  					return err;
	  				}

	  				return updatedPet;
	  			});
			else return new Animal(toBeSaved).save(function(err, newPet){
				if(err){
					console.log(err);
					return err;
				}

				return newPet;
			});

			
		})
		.catch(function(err){
			console.log(err);
			return reject(err);
		});
	},
	getPets : function(){
		return new Promise(function (resolve, reject) {
			Animal.find().populate('gender kind').exec(function(err, pets){
			 		if (err) {
			 			console.log(err);
			 			reject(err);
			 		}
			 		else{
			 			resolve(pets);
			 		}	
			 	});
		});
	},
	getAdoptablePets : function(){
		return new Promise(function (resolve, reject) {
			Animal.find().populate('gender kind').exec(function(err, pets){
			 		if (err) {
			 			console.log(err);
			 			return reject(err);
			 		}
			 		
			 		return resolve(pets);
			 	});
		})
		.then(function(pets){
			return adoptorLogic.getAdoptionApplications()
			.then(function(applications){
				var animalsToNeglect = [];

				if(applications){
					for(var i = 0; i < applications.length; i++){
						if(applications[i].status.code == 'ADOPTED' || applications[i].status.code == 'TRIAL'){
							animalsToNeglect.push(applications[i].animal._id.id);
						}
					}
				}

				return Promise.resolve({ allpets : pets, animalsToNeglect: animalsToNeglect });
			});
		})
		.then(function(result){
			var index, includePets = [];
			for(var  i = 0; i < result.allpets.length ; i++){
				index = result.animalsToNeglect.indexOf(result.allpets[i]._id.id);

				if(index == -1){
					includePets.push(result.allpets[i]);
				}
			}

			return Promise.resolve(includePets);
		});
	},
	getPetById : function(fields){
		return Animal.findById(fields.id).populate('gender kind user').exec()
				.then(function(pet){
					return pet;
				}, function(err){
					return err
				});
	}
}