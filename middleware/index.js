var User = require("../models/user"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObj = {};

// Middlewares
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("back");
};

middlewareObj.isCampgroundAuthor = function (req, res, next) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            if (foundCampground.author.id.equals(req.user._id)) {
                return next();
            }
            res.redirect("back");
        }
    });
};

middlewareObj.isCommentAuthor = function (req, res, next) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            if (foundComment.author.id.equals(req.user._id)) {
                return next();
            }
            res.redirect("back");
        }
    });
};

module.exports = middlewareObj;