var bodyParser=require("body-parser"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer"),
    mongoose=require("mongoose"),
    express=require("express"),
    app=express();
  // App config    
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//sanitizer must be used below bodyParser
app.use(expressSanitizer());
app.use(methodOverride("_method"));
  //Mongoose config
var bodySchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}   //  to take a curren date
});

var Blog=mongoose.model("Blog",bodySchema);
   //Creating a blog
// Blog.create({
//   title:"APJ Abdul Kalam",
//   image:"http://www.abdulkalam.com/kalam/theme/jsp/guest/alubam-collection6.jsp",
//   body:"He is good person"
// });
  //RestfullRoutes
  
 app.get("/",function(req,res){
    res.redirect("/blogs"); 
 });
   //Index routes
 app.get("/blogs",function(req,res)
 {
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Something went wrong");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});
// new route
app.get("/blogs/new",function(req, res) {
   res.render("new"); 
});
//create route
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){  //req.body.blog, here blog is an obj comes in post request contains title,img,body  
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
//Show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
       if(err){
         res.redirect("/blogs");
       } else
       {
            res.render("show",{blog:foundblog});
       }
    });
   
});
//Edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
       if(err){
           res.render("/blogs");
       } else{
           res.render("edit",{blog:foundblog});  
       }
    });
});
//Update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs/"+req.params.id);
      }
   });
});
//Delete  route
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err,deletedpost){
       if(err){
           res.redirect("/blogs");
       }
       else{
           res.redirect("/blogs");
       }
   }) ;
});
app.listen(process.env.PORT,process.env .IP,function()
{
    console.log("Server started");
});
    
    