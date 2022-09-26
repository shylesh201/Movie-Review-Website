const express=require('express')
const app = express()
const body_parse=require('body-parser')
const ejs=require('ejs')
const _=require('lodash')
// console.log(_.lowerCase("AMn aDs POOwer"));  a mn a ds po ower

const mongoose=require('mongoose')
app.use(express.static("public"))
app.use(body_parse.urlencoded({ extended:true}))
app.set('view engine','ejs')

mongoose.connect("mongodb://localhost:27017/intdb", {useNewUrlParser: true});
const home_page="Welcome to the movie review site Freshtomatoes.com"
const about_page="This application helps people write reviews about their favourite movie."
const contact_page="Contact me at: "

const intSchema={
    movie: String,
    genre:String,
    rating:String,
    describe:String
}
const exp=mongoose.model("exp",intSchema);

app.get('/', function(req, res){
    exp.find({}, function(err, posts){
        res.render('home',{homes:home_page,posts:posts})
      });
   
})
app.get('/about', function(req, res){
    res.render('about',{about:about_page})
})

app.get('/contact', function(req, res){
    res.render('contact',{contact:contact_page})
})


app.get('/compose', function(req, res){
    res.render('compose');
})


app.post('/compose', function(req, res){
    const ex=new exp({
        movie:req.body.movie,
        genre:req.body.genre,
        rating:req.body.rating,
        describe:req.body.describe
    })
    ex.save(function(err){
        if (!err){
            res.redirect("/");
        }
      });
})

app.get("/:company", function(req, res){
    var comp=_.lowerCase(req.params.movie);

   /* exp.find({}, function(err, posts){
        if(err){
            console.log(err);

        }
        else{
        posts.forEach(function(post){
        var stored=_.lowerCase(post.company);
        if (comp==stored){
            flag=1;
            console.log(comp+" Match is found");
            return res.render("post",{po:post})
        }

       })*/
       var flag=0
       var vela=[]
       exp.find({}, function(err, posts){
        posts.forEach(function(post){
        var stored=_.lowerCase(post.movie);
        if(comp==stored){
        vela.push(post)
        flag+=1
        }
   
 })
 if (flag>0){
      res.render("post_mull",{posts:vela})
 }
 else {
    res.render("reject")
    }
  

})  
  
 
})

  app.get("/details/:id",function(req, res){
    exp.find({_id:req.params.id}, function(err, posts){
      posts.forEach(function(pond){
      res.render("post",{po:pond})
      })
    })
  })
  app.get("/job/:position", function(req, res){
       var pos=_.lowerCase(req.params.position);
       console.log("Job position:",pos)

       var flag1=0;
       var vela1=[]
       exp.find({}, function(err, posts){
        posts.forEach(function(post){
        var stored=_.lowerCase(post.post);
        if(pos==stored){
        vela1.push(post)
        flag1+=1
        }
   
 })
 if (flag1>0){
      res.render("post_mull",{posts:vela1})
 }
 else {
    res.render("reject")
    }
  

})      
  })

app.get("/details/:id",function(req, res){
    exp.find({_id:req.params.id}, function(err, posts){
      posts.forEach(function(pond){
      res.render("post",{po:pond})
      })
    })
  })

  app.post("/details/:id",function(req, res) 
  {  
      exp.findByIdAndDelete(req.params.id,function(err){
          if(err)
          {
              console.log(err);
          }
          else{
              console.log("deletion successful");
              res.redirect("/");
          }
      });
      
  });
  app.get("/mod/:id",function(req, res){
    exp.find({_id:req.params.id}, function(err, posts){
      posts.forEach(function(pond){
      res.render("mod",{po:pond})
      })
    })
  })
  app.post("/mod/:id",function(req, res)
  {
    
      exp.findByIdAndUpdate(req.params.id,{ $set:{describe: req.body.describe, movie: req.body.movie,
        genre:req.body.genre,rating:req.body.rating}},function(err){
          if(err)
          {
              console.log(err);
          }
          else{
              console.log("modified");
              res.redirect("/");
          }
      
  });
  })
app.listen(3000, function(){
   console.log("Server up and running")
})