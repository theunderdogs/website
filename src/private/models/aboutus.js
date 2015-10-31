// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('AboutUs', new Schema({ 
    html: {
        type: String//,
        //trim: true
    }, /* used for token */
    created: {
        type: Date,
        default: Date.now
    }
}));