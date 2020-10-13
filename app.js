const  express            = require("express"),
       app                = express(),
       port               = 2002,
       bodyParser         = require("body-parser"),
       mongoose           = require("mongoose"),
       Campground         = require("./models/campground"),
       Comment            = require("./models/comment"),
       passport           = require("passport"),
       flash              = require("connect-flash"),
       LocalStrategy      = require("passport-local"),
       passportLocalMongoose      = require("passport-local-mongoose"),
       User                       = require("./models/user"),
       methodOverried             = require("method-override");

//requring routes
const  commentRoutes    = require("./routes/comments"),
       campgroundRoutes = require("./routes/campgrounds"),
       authRoutes       = require("./routes/index") 



mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true})); //for body-parser
app.set("view engine", "ejs"); //for ejs
app.use(express.static(__dirname + "/public")); //Connecting css with js
app.use(methodOverried("_method"));
app.use(flash());



//Passport configuration
app.use(require("express-session")({
    secret:         "Lefke",
    resave:          false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for currentUser
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(port, () => {
   console.log("Server on port 2002 started succesfully!");
});