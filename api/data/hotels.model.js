var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true,
        min : 0,
        max : 5 
    },
    review : {
        type : String,
        requied : true
    },
    createdOn : {
        type : Date,
        "default" : Date.now
    }
});

var roomSchema = new mongoose.Schema({
   type : String,
   number : Number,
   description : String,
   photos : [String],
   price : Number
});

// NESTED SCHEMAS MUST BE DEFINED BEFORE PARENT SCHEMA

var hotelSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    stars : {
        type : Number,
        min : 0,
        max : 5, 
        default : 0
    },
    description : String,
    photos : [String],
    currency : String,
    reviews : [reviewSchema],
    services : [String],
    rooms : [roomSchema],
    location : {
        address : String,
        // Always store coordinates longitude, latitude order
        coordinates : {
            type : [Number],
            index : '2dsphere'
        }
    }
});

mongoose.model('Hotel', hotelSchema, 'hotels');