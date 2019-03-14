var express = require("express");
var app= express();

var request=require("request");
app.set("view engine","ejs");


app.get("/search", function(req,res){
	res.render("search.ejs");
});



app.get("/result", function(req,res){
	//to retrive the data after hiting subbmit we use query method
	//below search is coming from <form name>
	var query=req.query.search;
	//we could directly use the query varibale like .com/?s=""+query else like below
	var url="http://www.omdbapi.com/?s="+query+"&apikey=5b3caabe";
	
	request(url,function(error,response,body){
		if(!error&&response.statusCode ==200){
			var data = JSON.parse(body)
			res.render("result",{data:data})
		}
	});
});






app.listen(2000,function(){
	console.log("movie server up");
});