let mongoose = require('mongoose');

//article schema
let placeSchema = mongoose.Schema({
    destination: {
        type: String,
        required: true

    },
    coords: {
        lg: {
            type: String
        },
        lt: {
            type: String
        }
    },
    location: {
        type: Object
    },
    squad: {
        type: Number,
       
    },
    dateFrom: {
        type: Date,
        

    },
    dateTo: {
        type: Date
        
    },
    created: {
        type: Date
    }
    

});

let Place = module.exports = mongoose.model('Place', placeSchema)