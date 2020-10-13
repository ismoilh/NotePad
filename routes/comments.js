const express    = require("express"),
      router     = new express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment")


//New Route for comments
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    //Campground is not defined in comments.ejs page
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments", {campground: campground});
        }
    });
});

//Create route for comments
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //Shwoing the author of comment 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();



                    campground.comments.push(comment);
                    campground.save(); 
                    req.flash("success", "Succesfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Edit route of comment
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log("err");
        } else {
            res.render("editcomments", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Update route of comments
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete route for comments
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deleted){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("back");
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

//Middleware        req.flash("error", "You need to be logged in");

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
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