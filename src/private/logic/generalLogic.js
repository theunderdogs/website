var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
DataType = mongoose.model('DataType');

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
	}
}