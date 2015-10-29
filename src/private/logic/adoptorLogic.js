var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
AdoptionApplication = mongoose.model('AdoptionApplication'),
DataType = mongoose.model('DataType');

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
					status : JSON.parse(fields.status)
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
  			.populate({
				    path: 'animal'
				  , select: 'name'})
  			.populate('status')
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

		var p1 = new Promise(function(resolve, reject){
			AdoptionApplication.findById( JSON.parse(fields.application)._id)
			.populate('status')
			.exec(function(err, application){
				if(err){
					return reject();
				}else{
					if(!application){
						return reject();
					}

					if(application.status.optionValue === fields.answer){
						return reject();
					}

					return resolve(application);
				}
			});
		});

		var p2 = new Promise(function(resolve, reject){
			DataType.findOne({ type: 'applicationStatus', optionValue: fields.answer }, function(err, dataType){
		 		if (err) {
		 			console.log(err);
		 			return reject(err);
		 		}
		 		
		 		return resolve(dataType);	
			 });
		});

		return p1.then(function(application){
			_application = application;
			return p2;
		})
		.then(function(dataType){
			
			return new Promise(function(resolve, reject){

				AdoptionApplication.update({ _id : _application._id }, { status: dataType, notes : JSON.parse(fields.application).notes }, { multi: true },
					function(err, numAffected){
						if(err){
							return reject(err.message);
						}

						return resolve(numAffected);
					});
			});
		})
		.catch(function(err){
			throw new Error(err.message);
		});
	}
}