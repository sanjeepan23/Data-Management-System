var mongoose = require("mongoose");
const { stringify } = require("querystring");

var UserSchema = new mongoose.Schema({
    username:String,
    division: Number,
    gender:Number,
    designation:String,
    mobile:String,
    email:String,
    password:String,
    code: Number,
    status: Number,
    level:Number,
    // events: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref:"Event" 
    //     }
    // ]
});

module.exports = mongoose.model("User",UserSchema);