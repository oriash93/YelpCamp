var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: { type: String, default: "default.jpg" },
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);