var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
	res.render("landing page.ejs");
});

router.get("/register",function(req,res){
	res.render("register")
})

router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
 	if(req.body.adminCode==='jay'){
 		newUser.isAdmin = true;
 	}
 	User.register(newUser, req.body.password, function(err,user){
 		if(err){
 			req.flash("error", err.message);
 			return res.render("register");
 		}
 		passport.authenticate("local")(req,res,function(){
 			req.flash("success","Welcome to yelp camp "+user.username);
 			res.redirect("/campground");
 		})
 	});
});

router.get("/login", function(req,res){

	res.render("login");
});

router.post("/login", passport.authenticate("local",
	{	

		successRedirect:"/campground",
		failureRedirect:"/login"
	}), function(req,res){

});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("error","logged you out");
	res.redirect("/campground");
})

function isLoggedIn(req, res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","please login first");
	res.redirect("/login");
}


module.exports=router;




