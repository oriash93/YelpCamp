var seedDB = require("./seeds"),
    express = require("express"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override");

// Data models
var User = require("./models/user"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

// Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds");
    indexRoutes = require("./routes/index");

// Express setup
var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Database setup
mongoose.connect('mongodb://localhost/yelp_camp');
seedDB();

// Passport configurations
app.use(require("express-session")({
    secret: "BoomShakaLak",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// Set routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Start server
var port = 27017;
app.listen(port, function () {
    console.log("Yelp Camp Server started on port", port);
});