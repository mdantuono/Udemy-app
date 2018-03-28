var mongoose = require('mongoose');
var Hotels = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
    
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    // A geoJSON point
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };
    
   Hotels.aggregate(
        [
            {
                '$geoNear': {
                    'near': point,
                    'spherical': true,
                    'distanceField': 'distance',
                    'maxDistance': 2000
                }
            },
            { 
             "$sort": {"distance": 1} // Sort the nearest first
            }
        ],
        function(err, results) {
            if (err) {
                res
                    .status(400)
                    .json({
                       "message" : "Invalid longitude or latitude coordinates" 
                    });
            }
            res
                .status(200)
                .json(results);
        }
    );
    
};

module.exports.hotelsGetAll = function(req, res) {
    
    var offset = 0;
    var count = 5;
    var maxCount = 10;
    
    if (req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
    }
    
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }
    
    if (isNaN(offset) || isNaN(count)) {
        res
            .status(400)
            .json({
                "message": "If supplied in querystring count and offset should be number values"
            });
        return;
    }
    
    if (count > maxCount) {
        res 
            .status(400)
            .json({
                "message" : "Count limit of " + maxCount + " exceeded"
            });
        return;
    }
    
    Hotels
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels) {
            var response = {
                status : 200,
                message : hotels
            };
             if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if (!hotels) {
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID not found"
                };
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.hotelsGetOne = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET the hotelId", hotelId);
    
    Hotels
        .findById(hotelId)
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : doc
            };
            if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID not found"
                };
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

var _splitArray = function(input) {
    var output;
    if (input && input.length > 0) {
        output = input. split(";");
    } else {
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(req, res) {

    Hotels
        .create({
            name : req.body.name,
            description : req.body.description,
            stars : parseInt(req.body.stars, 10),
            services : _splitArray(req.body.services),
            photos : _splitArray(req.body.photos),
            currency : req.body.currency,
            location : {
                address : req.body.address,
                coordinates : [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                    ]
            }
        }, function(err, hotel) {
            if (err) {
                console.log("Error creating hotel");
                res
                    .status(400)
                    .json(err);
            } else {
                console.log("Hotel created ", hotel);
                res
                    .status(201)
                    .json(hotel);
            }
        });
    
};