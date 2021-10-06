var express         = require("express"),
    bodyparser      = require("body-parser"),
    mongoose        = require("mongoose");

// =================== Start Singleton Pattern ===============
class connection {
    init(connection) {
        if(connection != null){ 
            this.connection = mongoose.connect("mongodb://localhost/admin",{useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false });
        }
    }
}
// =================== End Singleton Pattern ===============
  
module.exports = new connection();
  