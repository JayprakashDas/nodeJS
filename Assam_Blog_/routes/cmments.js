var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment")
var middleware = require("../middleware");



router.get("/new",middleware.isLoggedIn ,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			res.render("comments/new", {campground:campground});
		}
	})
	
});

router.post("/",middleware.isLoggedIn, function(req,res){

	Campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err)
		}
		else{
	
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err)
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campground/"+campground._id);
				}
			})
			
			
		}
	})
	

});

router.get("/:comments_id/edit", middleware.checkCommentauthorization, function(req,res){
	Comment.findById(req.params.comments_id, function(err,foundcomment){
		if(err){
			res.redirect("back");
		}
		else{	

		res.render("comments/eit",{campground_id:req.params.id,comment:foundcomment});
		}
	})

	

});

router.put("/:comments_id",middleware.checkCommentauthorization, function(req,res){
	Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err,updatescomment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campground/"+req.params.id);
		}

	});
	
});

router.delete("/:comments_id",middleware.checkCommentauthorization, function(req,res){
	Comment.findByIdAndRemove(req.params.comments_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campground/"+req.params.id);
		}
	})

});


module.exports = router;



