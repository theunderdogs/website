// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('AdoptionApplication', new Schema({ 
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    animal : {
		type: Schema.ObjectId,
        ref: 'Animal'
	}, /* used for token */
    status: {
        type: Schema.ObjectId,
        ref: 'DataType'
    },
    read: {
        type: String,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
}));