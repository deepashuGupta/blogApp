var mongoose = require("mongoose")
var express  = require("express")
var bodyParser = require("body-parser")
var expressSanitizer=require("express-sanitizer")
var methodOverride = require("method-override")
var app = express()

mongoose.connect("mongodb://localhost/blog_app",{
	useNewUrlParser: true,
  	useUnifiedTopology: true,
	useFindAndModify: false
});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var Blog = mongoose.model("blog",blogSchema)

app.get("/",function(req,res){
	res.redirect("/blogs")
});
// restfulRoute
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err)
		}else{
			res.render("index",{blogs:blogs});
		}
	});
});
// post route
app.post("/blogs",function(req,res){
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new")
		}else{
			res.redirect("/blogs")
		}
	});
});

app.get("/blogs/new",function(req,res){
	res.render("new")
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundPost){
		if(err){
			res.render("/blogs")
		}else{
			res.render("show",{blog: foundPost});
		}
	});
});
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log("error")
		}else{
			res.render("edit",{blog:foundBlog});
		}
	});
});
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlg){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" +req.params.id);
		}
	});
});
// delete route
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,blogDelete){
		if(err){
			res.send("it,s an error please go back")
		}else{
			res.redirect("/blogs")
		}
	});
});
app.listen(process.env.PORT,process.env.IP,function(){
	console.log("bolg app is started..")
})