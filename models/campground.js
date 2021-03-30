const mongoose = require("mongoose"); 

const campgroundSchema = new mongoose.Schema({
    name: String,
    description: String,
    time: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
 });
 
module.exports = mongoose.model("Campground", campgroundSchema);  
