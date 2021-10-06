var mongoose    = require("mongoose");
// schema setup
var familySchema = new mongoose.Schema({
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
    gnDivision:Number,
    dsDivision:String,
    division:Number,
    // members: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref:"Member" 
    //     }
    // ]
});

module.exports = mongoose.model("Family",familySchema);