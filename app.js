const express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    methodOverried = require("method-override")
//requring routes
const campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index")

// connection for postgresql
const { Client } = require('pg')

// clients will also use environment variables
// for connection information
const client = new Client()
await client.connect()

const res = await client.select

mongoose.connect("mongodb://localhost:27017/notepad", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB Connected"))
    .catch(error => console.log(error));

app.use(bodyParser.urlencoded({ extended: true })); //for body-parser
app.set("view engine", "ejs"); //for ejs
app.use(express.static(__dirname + "/public")); //Connecting css with js
app.use(methodOverried("_method"));
app.use(flash());

//Passport configuration
app.use(require("express-session")({
    secret: "Lefke",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for currentUser
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use(campgroundRoutes);

app.listen(port, () => {
    console.log("Server has started succesfully");
});