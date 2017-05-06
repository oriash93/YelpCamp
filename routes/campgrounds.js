var express = require("express");
var middleware = require("../middleware");
var User = require("../models/user"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");
var router = express.Router();

// Index route
router.get("/", function (req, res) {
    // Retrieve all campgrounds from database
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            req.flash("error", "Campground not found");
        } else {
            // Render the index page with the retrieved collection
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// New route
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// Create route
router.post("/", middleware.isLoggedIn, function (req, res) {
    // Create new campground and associate with user
    Campground.create({
        name: req.body.campgroundName,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, function (err, newCampground) {
        if (err) {
            req.flash("error", "Something went wrong");
        } else {
            // Redirect to campgrounds page
            req.flash("success", "Successfully added campground");
            res.redirect("/campgrounds");
        }
    });
});

// Show route
router.get("/:id", function (req, res) {
    // Retrieve the campground with matching ID from database
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            req.flash("error", "Campground not found");
        } else {
            // Render the show page with the retrieved campground            
            res.render("campgrounds/show", { campground: campground });
        }
    });
});

// Edit route
router.get("/:id/edit", middleware.isLoggedIn, middleware.isCampgroundAuthor, function (req, res) {
    // Retrieve the campground with matching ID from database
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            // Render the edit page with the retrieved campground            
            res.render("campgrounds/edit", { campground: campground });
        }
    });
});

// Update route
router.put("/:id", middleware.isLoggedIn, middleware.isCampgroundAuthor, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy route
router.delete("/:id", middleware.isLoggedIn, middleware.isCampgroundAuthor, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;