// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('DataType', new Schema({ 
    type: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        trim: true
    },
	optionValue: {
        type: String,
        trim: true
    }
}));