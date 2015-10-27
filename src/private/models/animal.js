// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Animal', new Schema({ 
    name: {
        type: String,
        trim: true
    },
    gender: {
        type: Schema.ObjectId,
        ref: 'DataType'
    },
    kind: {
        type: Schema.ObjectId,
        ref: 'DataType'
    },
    specifyKind: {
        type: Schema.ObjectId,
        ref: 'DataType'
    },
    breed: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    weight: {
        type: String,
        trim: true
    },
    dateFound: {
        type: Date,
    },
    age: {
        type: String,
        trim: true
    },
    status: {
        type: Schema.ObjectId,
        ref: 'DataType'
    },
    notes: {
        type: String,
        trim: true
    },
    photoUrls : {
        type: [String]
    },
    user : {
		type: Schema.ObjectId,
        ref: 'User'
	}, /* used for token */
    created: {
        type: Date,
        default: Date.now
    }
}));