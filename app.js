var bodyParser = require("body-parser"),
    express = require("express"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

seedDB();

// Express app setup
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Start server
var port = 27017;
app.listen(port, function () {
    console.log("Yelp Camp Server started on port", port);
});
mongoose.connect('mongodb://localhost/yelp_camp');

// Campground Routes
app.get("/", function (req, res) {
    res.redirect("/campgrounds");
});

// INDEX
app.get("/campgrounds", function (req, res) {
    // Retrieve all campgrounds from database
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log("Error:", err);
        } else {
            // Render the index page with the retrieved collection
            res.render("campgrounds/index", { title: "Campgrounds", campgrounds: campgrounds });
        }
    });
});

// NEW
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new", { title: "New Campground" });
});

// CREATE
app.post("/campgrounds", function (req, res) {
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

// SHOW
app.get("/campgrounds/:id", function (req, res) {
    // Retrieve the campground with matching ID from database
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log("Error:", err);
        } else {
            // Render the show page with the retrieved campground            
            res.render("campgrounds/show", { title: campground.name, campground: campground });
        }
    });
});

// EDIT
app.get("/campgrounds/:id/edit", function (req, res) {
    //res.render("campgrounds/edit", { title: campground.name, campground: campground });
});

// UPDATE
app.put("/campgrounds/:id", function (req, res) {
    //res.render("campgrounds/show", { title: campground.name, campground: campground });
});

// DESTROY
app.delete("/campgrounds/:id", function (req, res) {
    //res.render("campgrounds/show", { title: campground.name, campground: campground });
});

// Comments Routes

// NEW
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { title: "New Comment", campground: campground });
        }
    });
});

// CREATE
app.post("/campgrounds/:id/comments", function (req, res) {
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