var seedDB = require("./seeds"),
    express = require("express"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override");

require("dotenv").config();

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Data models
var User = require("./models/user"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

// Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// Express setup
var app = express();
app.set("view engine", "ejs");
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Database setup
mongoose.connect(process.env.DATABASEURL);

// Uncomment the next line to seed the database
//seedDB(); 

// Session configurations
app.use(session({
    secret: "BoomShakaLak",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

// Passport configurations
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Set routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Start server
var port = 27017;
app.listen(process.env.PORT || port, process.env.IP, function () {
    console.log("Yelp Camp Server started on port", port);
});