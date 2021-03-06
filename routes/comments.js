var express = require("express");
var middleware = require("../middleware");
var User = require("../models/user"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");
var router = express.Router({ mergeParams: true });

// New route
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            req.flash("error", "Campground not found");
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// Create route
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds/");
        } else {
            // Create new comment 
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                } else {
                    // Associating comment with user
                    comment.author = {
                        id: req.user._id,
                        username: req.user.username
                    };
                    comment.save();

                    // Associating campground with comment
                    campground.comments.push(comment);
                    campground.save();

                    // Redirect to campgrounds page
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Edit route
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.isCommentAuthor, function (req, res) {
    // Retrieve the comment with matching ID from database
    Comment.findById(req.params.comment_id, function (err, comment) {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            res.render("comments/edit", { comment: comment, campground_id: req.params.id });
        }
    });
});

// Update route
router.put("/:comment_id", middleware.isLoggedIn, middleware.isCommentAuthor, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, campground) {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy route
router.delete("/:comment_id", middleware.isLoggedIn, middleware.isCommentAuthor, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;