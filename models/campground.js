var mongoose = require("mongoose"); 

var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            //Connecting comments with campgrounds arrays
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
 });
 
module.exports = mongoose.model("Campground", campgroundSchema);  
