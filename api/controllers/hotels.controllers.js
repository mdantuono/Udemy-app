module.exports.hotelsGetAll = function(req, res) {
    console.log("GET the json");
       res
        .status(200)
        .json({ "jsonData" : true });
};
module.exports.hotelsGetOne = function(req, res) {
    console.log("GET the hotels");
       res
        .status(200)
        .json( hotelData );
};