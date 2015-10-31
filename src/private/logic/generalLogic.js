var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
DataType = mongoose.model('DataType'),
AboutUs = mongoose.model('AboutUs'),
Volunteer = mongoose.model('Volunteer');

module.exports = {
	getTypes : function(){
		return new Promise(function (resolve, reject) {
			DataType.find(function(err, dataTypes){
			 		if (err) {
			 			console.log(err);
			 			return reject(err);
			 		}
			 		
			 		return resolve(dataTypes);
			 			
			 	});
		});
	},

	getAboutUsHtml : function(){
		return new Promise(function (resolve, reject) {
			AboutUs.find({}, null, {sort: {created: -1}}, function(err, docs){
			 		if (err) {
			 			console.log(err);
			 			return reject(err);
			 		}
			 		
			 		if(!docs){
			 			return reject();
			 		}

			 		return resolve(docs[0]);
			 			
			 	});
		});
	},

	saveAboutUsHtml : function(fields){
		
		return new Promise(function(resolve, reject){
				var newApplication = new AboutUs({ 
					html: fields.html
				}).save(function(err) {
				    if (err) {
				    	return reject(err);
				    }else{
				    	return resolve();	
				    }
				 });
			});
	},

	saveNewVolunteer : function(fields){
		
		return new Promise(function(resolve, reject){
				var newApplication = new Volunteer({ 
					firstName: fields.firstName,
					lastName : fields.lastName, 
				    phone: fields.phone, 
				    email: fields.email
				}).save(function(err) {
				    if (err) {
				    	return reject(err);
				    }else{
				    	return resolve();	
				    }
				 });
			});
	},

	getVolunteers : function(){
		return new Promise(function (resolve, reject) {
			Volunteer.find(function(err, volunteers){
			 		if (err) {
			 			console.log(err);
			 			return reject(err);
			 		}
			 		
			 		return resolve(volunteers);
			 			
			 	});
		});
	}
}