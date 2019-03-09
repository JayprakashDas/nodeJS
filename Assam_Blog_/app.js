var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose= require("mongoose");
var Campground = require("./models/campground.js");
// var seedDB = require("./models/seeds.js");
var Comment =require("./models/comment");
var passport =require("passport");
var LocalStrategy =require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var campgroundRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/cmments");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_V9");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));

app.use(flash());

app.use(methodOverride("_method"));


app.use(require("express-session")({
	secret: "once again rusty wins",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser =req.user;
	res.locals.error = req.flash("error");
	res.locals.success =req.flash("success");
	next();

});

app.use("/",indexRoutes);
app.use("/campground",campgroundRoutes);
app.use("/campground/:id/comments",commentsRoutes);


app.listen("3000",function(){
 console.log("sever is up");
});