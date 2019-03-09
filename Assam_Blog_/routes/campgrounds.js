var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
	Campground.find({},function(err, allCampground){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/campground",{campground:allCampground, currentUser: req.user});
		}

	});
	
	
});

router.post("/",middleware.isLoggedIn,function(req,res){

	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {id:req.user._id,
					username: req.user.username

			}
	var newcampground={name:name, image:image, description:description, author:author}

	Campground.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err)
		}
		else{
			res.redirect("/campground");
		}
	});
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new")

});


router.get("/:id",function(req, res){
	
	Campground.findById(req.params.id).populate("comments").exec(function(err, found){

		if (err) {
			console.log(err);
		}
		else{
			console.log(found);
			res.render("campgrounds/show",{campground: found});
		}
	})
	
});

router.get("/:id/edit",middleware.checkCampgroundauthorization, function(req,res){
	Campground.findById(req.params.id, function(err,foundcampground){
		res.render("campgrounds/edit",{campground:foundcampground});
	});
	
	
});

router.put("/:id",middleware.checkCampgroundauthorization, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campgrounds,function(err,update){
		if(err){
			res.send("error");
		}
		else{
			res.redirect("/campground/"+req.params.id);
		}
	})
});


router.delete("/:id",middleware.checkCampgroundauthorization, function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.send("err");
		}
		else{
			res.redirect("/campground");
		}
	});
});



module.exports = router;


