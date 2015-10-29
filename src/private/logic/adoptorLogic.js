var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
AdoptionApplication = mongoose.model('AdoptionApplication');
//Animal = mongoose.model('Animal'),

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

			// AdoptionApplication.find(function(err, applications){
			//  		if (err) {
			//  			console.log(err);
			//  			reject(err);
			//  		}
			//  		else{
			//  			resolve(applications);
			//  		}	
			//  	});
		});
	}
}