var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
AdoptionApplication = mongoose.model('AdoptionApplication'),
DataType = mongoose.model('DataType'),
_ = require('lodash-node');

module.exports = {

	submitAdoptionApplication : function(fields){
		
		return new Promise(function(resolve, reject){
				var newApplication = new AdoptionApplication({ 
					firstName: fields.firstName,
					lastName : fields.lastName, 
				    phone: fields.phone, 
				    email: fields.email,
				    address : fields.address,
					animal : JSON.parse(fields.animal),
					status : JSON.parse(fields.status),
					notes : fields.notes
				}).save(function(err) {
				    if (err) {
				    	return reject(err);
				    }else{
				    	return resolve();	
				    }
				 });
			});
	},

	getAdoptionApplications : function(){
		return new Promise(function (resolve, reject) {
			
  			AdoptionApplication.find()
  			.populate('animal status')
  			.exec(function(err, applications){
			 		if (err) {
			 			console.log(err);
			 			reject(err);
			 		}
			 		else{
			 			resolve(applications);
			 		}	
			 	});
		});
	},

	setStatusForApplication : function(fields){
		var _application;

		return new Promise(function(resolve, reject){
			AdoptionApplication.findById( JSON.parse(fields.application)._id)
			.populate('status animal')
			.exec(function(err, application){
				if(err){
					return reject();
				}else{
					if(!application){
						reject();
					}
					else if(application.status.code === fields.answer){
						reject();
					} else{
						resolve(application);
					}
				}
			});
		}).then(function(application){
			return new Promise(function(resolve, reject){
				AdoptionApplication
				.find({ animal : application.animal })
				.populate('status')
				.exec(function(err, applications){
					var turnDown = false;
					if(err) {
						reject();
					}else if(!applications){
						reject()
					}else{
						for(var i = 0; i < applications.length; i++){
							if(JSON.parse(fields.application)._id != applications[i]._id){
								if((applications[i].status.code === 'ADOPTED' || applications[i].status.code === 'TRIAL') && fields.answer === 'TRIAL'){
									return reject();//turnDown = true;
								}else if((applications[i].status.code === 'TRIAL' || applications[i].status.code === 'ADOPTED') && fields.answer === 'ADOPTED'){
									return reject();//turnDown = true;
								}else if(fields.answer === 'NEWAPPLICATION'){
									return reject();//turnDown = true;
								}
							}
						}

						resolve();
					}
				});
			});	
		})
		.then(function(){
			return new Promise(function(resolve, reject){
						//if(turnDown == false){
							DataType.findOne({ code : fields.answer }).exec(function(err, dataType){
						 		if (err) {
						 			reject(err);
						 		} else if (!dataType) {
						 			reject();
						 		} else{
						 			resolve(dataType);		
						 		}
						 	});
					});
		})
		.then(function(dataType){
			return new Promise(function(resolve, reject){
				AdoptionApplication.update({ _id : JSON.parse(fields.application)._id }, 
								{ status: dataType, notes : JSON.parse(fields.application).notes }, 
								{ multi: true },
								function(err, numAffected){
									if(err){
										return reject(err.message);
									}

									resolve(numAffected);
								});
			});
		})
		.catch(function(err){
			throw new Error(err.message);
		});
	}
}