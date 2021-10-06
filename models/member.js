var mongoose = require("mongoose");

var memberSchema = mongoose.Schema({
    relation:Number,
    fname:String,
    lname: String,
    dob:String,
    gender:Number,
    nic:String,
    email:String,
    mobile:String,
    religion:Number,
    ethnic:Number,
    jobState : Number,
    job:String,
    monthlyIncome:String,  
    temporaryAddress:String,
    permanentAddress:String,
    familyID:String,  
    division:Number
});

module.exports = mongoose.model("Member",memberSchema);