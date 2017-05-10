var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var descriptionSeed = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices malesuada interdum. Donec magna mauris, commodo id quam sed, cursus dignissim erat. Donec id commodo erat. Morbi vel auctor leo. Suspendisse sapien erat, placerat sed arcu ac, sodales porttitor elit. Curabitur mattis lobortis cursus. Praesent sagittis magna justo, id finibus ligula malesuada vitae. Suspendisse sit amet erat fermentum, facilisis lacus vitae, laoreet dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque maximus elit ante, nec pulvinar nisl tristique sit amet. Fusce ultrices ornare ornare.";
var campgroundUsernameSeed = "Barack Obama";
var commentUsernameSeed = "Donald Trump";

var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
        description: descriptionSeed,
        price: 10,
        author: {
            username: campgroundUsernameSeed
        }
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description: descriptionSeed,
        price: 12.50,
        author: {
            username: campgroundUsernameSeed
        }
    },
    {
        name: "Canyon Floor",
        image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg",
        description: descriptionSeed,
        price: 100.35,
        author: {
            username: campgroundUsernameSeed
        }
    },
];

function seedDB() {
    console.log("Seeding Database...")
    Campground.remove({}, function (err) {
        console.log("Removing all campgrounds...")
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all campgrounds");
            Comment.remove({}, function (err) {
                console.log("Removing all comments...")
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
                                    text: "This place is great, no WiFi though.",
                                    author: {
                                        username: commentUsernameSeed
                                    }
                                }, function (err, comment) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("Created a new comment");
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