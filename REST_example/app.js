var express= require("express");
var	mongoose=require("mongoose");
var	bodyParser=require("body-parser");
var methodOverride=require("method-override");
var	app=express();

//app config
mongoose.connect("mongodb://localhost/REST");
app.set("view engine","ejs");
// //to use CSS
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//Mongoose Schema//Model-config
var blogSchema =new mongoose.Schema({
	title: String,	
	image: String,
	body: String,
	created: {type: Date, default:Date.now}
});
var Blog = mongoose.model("blog", blogSchema);


//REST Routes
app.get("/",function(req,res){
	res.redirect("/blog");
});



//INDEX ROUTE
app.get("/blog",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERRor")
		}
		else{
			res.render("index",{blogs:blogs})
		}
	})
});




//NEW route
app.get("/blog/new",function(req,res){
	res.render("new");
});


//CREATE route
app.post("/blog",function(req, res){

	//  var title = req.body.title;
	//  var image = req.body.image;
	//  var body =  req.body.body;

	// var insertedblog = {title:title, image:image, body:body}

	Blog.create(req.body.blog, function(err,newblog){
		if(err){
			res.render("new")
		}
		else{

			res.redirect("/blog");
		}

	});

});

//SHOW route
app.get("/blog/:id",function(req,res){
	//the res.params.id given below is used to retrive the id from the above id
	Blog.findById(req.params.id, function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show", {blog:foundblog});
		}
	});
});


//EDIT route
app.get("/blog/:id/edit",function(req,res){
	//to Edit and update we need to first find out the blogs by the ID
	Blog.findById(req.params.id, function(err,foundblog){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.render("edit", {blog:foundblog});
		}
	});

});


//UPDATE route
app.put("/blog/:id", function(req,res){
	//Method to update 
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedblog){
			if(err){
				res.redirect("/blog");
			}
			else{
				res.redirect("/blog/"+ req.params.id);
			}
		})
});


//DELETE ROute
app.delete("/blog/:id",function(req,res){
	//Destroy and redirect
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.redirect("/blog");
		}
	})
});





app.listen("3000",function(){
	console.log("Server is UP");
});