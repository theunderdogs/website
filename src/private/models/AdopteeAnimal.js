// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('AdopteeAnimal', new Schema({ 
    gender: {
        type: Schema.ObjectId,
        ref: 'Animal'
    },
    kind: {
        type: Schema.ObjectId,
        ref: 'AdoptionApplication'
    },
    specifyKind: {
        type: Schema.ObjectId,
        ref: 'DataType'
    },
    created: {
        type: Date,
        default: Date.now
    }
}));