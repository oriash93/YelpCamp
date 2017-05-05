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

// RESTful Routes
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
            res.render("index", { title: "Campgrounds", campgrounds: campgrounds });
        }
    });
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

// NEW
app.get("/campgrounds/new", function (req, res) {
    res.render("new", { title: "New Campground" });
});

// SHOW
app.get("/campgrounds/:id", function (req, res) {
    // Retrieve the campground with matching ID from database
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log("Error:", err);
        } else {
            // Render the show page with the retrieved campground            
            res.render("show", { title: campground.name, campground: campground });
        }
    });
});

// EDIT
app.get("/campgrounds/:id/edit", function (req, res) {
    //res.render("edit", { title: campground.name, campground: campground });
});

// UPDATE
app.put("/campgrounds/:id", function (req, res) {
    //res.render("show", { title: campground.name, campground: campground });
});

// DESTROY
app.delete("/campgrounds/:id", function (req, res) {
    //res.render("show", { title: campground.name, campground: campground });
});