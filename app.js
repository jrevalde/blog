const express = require("express");
const multer = require('multer');
//const formData = require("express-form-data");
//const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/blogDB');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model('blog', blogSchema);



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




//GLOBALS SECTION

//let posts = []; //this array will be replaced by persistent mongoDB database

//END OF GLOBALS SECTION





app.get("/", function(req, res){


  Blog.find({}, function(err, posts){
    if (!err)
    {
      res.render("home", {p1 : homeStartingContent, posts : posts});
    }
  })
  
})


app.post("/", function(req, res){

})


app.get("/about", function(req, res){
  res.render("about", {p2 : aboutContent});
})




app.get("/contact", function(req,res){
  res.render("contact", {p3 : contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){
  const postTitle = req.body.title;         
  const comments = req.body.comments;       

  //var post = {title: postTitle, postComments : comments};             //console.log(post);
  const blog = new Blog({
    title: postTitle,
    content: comments
  });


  //posts.push(post);    //console.log(posts);
  blog.save(); //sends that new blog into the mongodb database collection called 'blogs'


  res.redirect("/");
})


app.get("/posts/:cummus", function(req, res){
  const requestedTitle = _.lowerCase(req.params.cummus);
  

  Blog.find({}, function(err, posts){
    if (!err)
    {
      posts.forEach(function(post){
        const storedTitle = _.lowerCase(post.title);
    
        if (storedTitle === requestedTitle)
        {
          res.render("post", {theTitle : post.title, paragraph : post.content});
        }
      }); 
    }
  });
  /*posts.forEach(function(post){
    
    if (storedTitle === requestedTitle)
    {
      //console.log("match found.");
      res.render("post", {theTitle : post.title, paragraph : post.postComments});
    }
    else
    {
      console.log("no match.");
    }
  });*/
});

app.post("/delete", function(req, res){
    const remove = req.body.remove;

    console.log(remove); // just checks that we do in fact recieve the Object ID (yes we do.);

    Blog.findByIdAndRemove(remove.trim(), function(err){
       if(!err)
       {
         console.log("succesful deletion.");
         res.redirect("/");
       }
    });
});





app.listen(3030, function() {
  console.log("Server started on port 3030");
});


/* IMPLEMENTATION LIST

1. Delete blog post (Completed)
2. pop up that says "are you sure you want to remove this post?" and then it deletes the post if they click yes.
2. optionally include and display image with blog post.

*/