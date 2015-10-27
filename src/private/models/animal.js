// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Animal', new Schema({ 
    created: {
        type: Date,
        default: Date.now
    },
	kind: {
        type: Schema.ObjectId,
        ref: 'DataType'
    },
    name: {
        type: String,
        trim: true
    }, 
    photoUrls : {
        type: [String]
    },
	user : {
		type: Schema.ObjectId,
        ref: 'User'
	} /* used for token */
}));