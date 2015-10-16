var mongoose = require('mongoose'),
Schema = mongoose.Schema,
Promise = require('promise/lib/es6-extensions'),
User = mongoose.model('User'),
fs = require('fs')
Animal = mongoose.model('Animal');

module.exports = {

	saveNewPet : function(fields, user, files){
		
		var promiseArray = []
			,urlArray = [];
		for(var i = 0; i < files.length; i++){

			promiseArray.push(new Promise(function(resolve, reject){

					if(files[i].headers['content-type'] != 'image/png'){
						reject(new Error('Only images allowed.'));
					}else{
						//throw error
						var tempPath = files[i].path;
						var targetPath = __dirname + '\\' + i + '.png';

						fs.rename(tempPath, targetPath, function(err) {
				            if(err) {
				            	//throw err
				            	reject(new Error(err.message));
				            }else{
				            	console.log("Upload completed!");
				            	urlArray.push(targetPath);
				            	resolve();
				        	}
				        });
					}
	
				})
			);
		}

		return Promise.all(promiseArray)
		.then(function(){
			return new Promise(function(resolve, reject){

				var newPet = new Animal({ 
				    kind: fields.kind, 
					name: fields.name,
					photoUrls: urlArray, 
					user: user
				}).save(function(err) {
				    if (err) {
				    	//throw err;
				    	reject(new Error(err.message));
				    }else{
				    	console.log('Animal saved successfully');
				    	resolve();	
				    }
				 });
			});
		});
	}
}