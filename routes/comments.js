var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

// New route
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// Create route
router.post("/", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/");
        } else {
            // Create new comment and associate to the campground    
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log("Error:", err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Added:", comment, "to", campground.name);
                    // Redirect to campgrounds page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;