// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('promise/lib/es6-extensions');

module.exports = {

	getUsers : function(){
		return new Promise(function (resolve, reject) {
			mongoose.model('User').find(function(err, users){
			 		if (err) console.log(err);
			 		resolve(users);	
			 	});
		});
	}
}