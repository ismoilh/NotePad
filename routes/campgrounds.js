const express = require("express"),
      router  = new express.Router(),
      Campground = require("../models/campground")


//INDEX = Display a list of all notes
router.get("/campgrounds", (req, res)=> {
    Campground.find({}, (err, allCampgrounds) =>{
        if(err){
            throw err;
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE = Add new note
router.post("/campgrounds", isLoggedIn, (req, res) =>{
    let name = req.body.name;
    let description  = req.body.description;
    const time = req.body.time;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, description: description, author: author, time:time};
    Campground.create(newCampground, (err, newlyCreated)=>{
       if(err){
           throw err;
           console.log(err);
       } else{
        res.redirect("/campgrounds");
    }
    });
});


//NEW = Display page for creatng new notes
router.get("/campgrounds/new", isLoggedIn, (req, res) =>{
    res.render("new");
});

//SHOW - show more info about note
router.get("/campgrounds/:id", (req, res)=>{
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
        if(err){
            throw err;
            console.log(err);
        } else{
            console.log(foundCampground);
            res.render("show", {campground : foundCampground});
        }
    });
});

//Edit Campground Route
router.get("/campgrounds/:id/edit", checkCampgroundOwnership,(req, res)=>{
        Campground.findById(req.params.id,(err, foundCampground)=>{
                    res.render("editcamp", {campground: foundCampground});
        });
});


//Update Campground Route
router.put("/campgrounds/:id",checkCampgroundOwnership,(req, res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,(err, updatedCampground)=>{
        if(err){
            res.redirect("/campgrounds");
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE 
router.delete("/campgrounds/:id", checkCampgroundOwnership, (req, res)=>{
    //Remove campground
    //Redirect to somewhere else 
    Campground.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
};


//Middleware
function checkCampgroundOwnership(req, res, next){
    //Cheking if user is logged in to edit smth
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(err){
                req.flash("error", "Campground not found");
                console.log(err);
                res.redirect("back");
            } else {
                //Checking if user is owning any data 
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "Permission denied");
                    res.redirect("back");
             }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

module.exports = router;