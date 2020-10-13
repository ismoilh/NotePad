const express  = require("express"),
      router   = new express.Router(),
      passport = require("passport"),
      User     = require("../models/user")

//Root Route
router.get("/", function(req, res){
    res.render("landingpage");
});

//Show register form
router.get("/register", function(req, res){
    res.render("register");
});

//Handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/campgrounds");
            console.log("You registered succesfully");
            console.log("Username:" + req.body.username, "   ", "Password:" + req.body.password);
        });
    });
});

//Show loginn form
router.get("/login", function(req, res){
    res.render("login");
});

//Handle Login page logic
router.post("/login",
 passport.authenticate("local", //Checking if User already registered or not yet!
 {  successRedirect: "/campgrounds", 
    failureRedirect:"/login"
 }),
 function(req, res){
     console.log(req.body.username, req.body.password);

});

//Logout Route 
router.get("/logout", function(req, res){
    req.logout();//Coming from package
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
};

module.exports = router;