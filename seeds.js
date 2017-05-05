var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor",
        image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg",
        description: "blah blah blah"
    },
];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all campgrounds");
            // Remove all comments
            Comment.remove({}, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Removed all comments");
                    // Add a few campgrounds
                    data.forEach(function (seed) {
                        Campground.create(seed, function (err, campground) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Added a campground");
                                // Create a comment
                                Comment.create({
                                    text: "This place is great, no WiFi tho",
                                    author: "Homer"
                                }, function (err, comment) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("Create a new comment");
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
}

module.exports = seedDB;