const express = require("express"),
      router  = new express.Router(),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment")


//INDEX = Display a list of all dogs
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE = Add new dog to db
router.post("/campgrounds", isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.bod.price;
    var image = req.body.image;
    var description  = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: description, author:author};
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
        res.redirect("/campgrounds");
    }
    });
});


//NEW = Display form to make  a new dog
router.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("new");
});

//SHOW - show more info about campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground);
            res.render("show", {campground : foundCampground});
        }
    });
});

//Edit Campground Route
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
                    res.render("editcamp", {campground: foundCampground});
        });
});


//Update Campground Route
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE 
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    //Remove campground
    //Redirect to somewhere else 
    Campground.findByIdAndRemove(req.params.id, function(err){
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
        Campground.findById(req.params.id, function(err, foundCampground){
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