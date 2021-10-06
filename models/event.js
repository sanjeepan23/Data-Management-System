var mongoose    = require("mongoose");
// schema setup
var eventSchema = new mongoose.Schema({
    title : String,
    date : String,
    time : String,
    place : String,
    requirements : String,
    user : String
});

module.exports = mongoose.model("Event",eventSchema);