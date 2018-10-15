let mongoose = require('mongoose');

//article schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true

    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true

    },
    created: {
        type: Date

    },
    updated: {
        type: Date
    },
    stamp: {
        type: Date
    },
    place: {
        type: String
    }

});


let Article = module.exports = mongoose.model('Article', articleSchema)