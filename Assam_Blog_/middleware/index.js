var middlewareObj ={};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundauthorization =function(req,res,next){
	
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err,foundcampground){
			if(err){
				req.flash("error","campground not found");
				res.render("error")
			}
			else{
				if(foundcampground.author.id.equals(req.user._id) ||req.user.isAdmin){
					next();
					
				}
				else{
					req.flash("error","you dont have permision to do that");
					res.redirect("back");
					
				}

				
			}
		})

	}
		else{
			req.flash("error","you need to be logged in");
			res.redirect("back")
		}
}

middlewareObj.checkCommentauthorization = function (req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comments_id, function(err,foundcomment){
			if(err){

				res.render("error")
			}
			else{
				if(foundcomment.author.id.equals(req.user._id)){
					next();
					
				}
				else{
					res.redirect("back");
					
				}

				
			}
		})

	}
		else{
			
			res.redirect("back")
		}


}



middlewareObj.isLoggedIn = function(req, res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","please login first");
	res.redirect("/login");
}

module.exports = middlewareObj;





