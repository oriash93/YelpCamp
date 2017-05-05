var express = require("express");
var router = express.Router();
var User = require("../models/user"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

// Index route
router.get("/", function (req, res) {
    // Retrieve all campgrounds from database
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log("Error:", err);
        } else {
            // Render the index page with the retrieved collection
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// New route
router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});

// Create route
router.post("/", function (req, res) {
    // Create new campground and add to the database
    Campground.create({
        name: req.body.campgroundName,
        image: req.body.image,
        description: req.body.description
    }, function (err, newCampground) {
        if (err) {
            console.log("Error:", err);
        } else {
            console.log("Added:", newCampground);
            // Redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// Show route
router.get("/:id", function (req, res) {
    // Retrieve the campground with matching ID from database
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log("Error:", err);
        } else {
            // Render the show page with the retrieved campground            
            res.render("campgrounds/show", { campground: campground });
        }
    });
});

// Edit route
router.get("/:id/edit", function (req, res) {
    //res.render("campgrounds/edit", { campground: campground });
});

// Update route
router.put("/:id", function (req, res) {
    //res.render("campgrounds/show", { campground: campground });
});

// Destroy route
router.delete("/:id", function (req, res) {
    //res.render("campgrounds/show", { campground: campground });
});

module.exports = router;