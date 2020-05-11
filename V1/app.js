var express        = require("express");
 app               = express();
 bodyParser        = require("body-parser");
 mongoose          = require("mongoose");
 passport          = require("passport");
 LocalStrategy     = require("passport-local");
 Product           = require("./models/products");
 Comment           = require("./models/comment");
 User              = require("./models/user");
 seedDB            = require("./seed");
 app.use(express.static(__dirname + "/public"))

const dbPath     = "mongodb://localhost:127.0.0.1:27017/lucian_express";

seedDB();

mongoose.connect(dbPath,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// PASSPORT CONFIGURATION
app.use(require("express-session")({
        secret: "This is the pass",
        resave: false,
        saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});






app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");






app.get("/", function(req,res){
    res.render("landing")
});




// INDEX ROUTE BELOW- SHOW ALL PRODUCTS
app.get("/products", function(req,res){
        console.log(req.user);
    // get all products from DB then render.
        Product.find({}, function(err,allproducts){
            if(err){
                console.log("SOMETHING WENT WRONG");
            } else{
            
                res.render("products/index", {product:allproducts, currentUser: req.user });

            }
        });

});

// POST route below. AKA CREATE ROUTE
// ADD NEW PRODUCTS TO DB

app.post("/products",function(req,res){
 // get data from form and add to products array
 var name = req.body.name;
 var image = req.body.image;
 var desc = req.body.description;
 var newProduct = {name: name, image:image, 
    description:desc}

// Create a new product and save to  DB
Product.create(newProduct, function(err,newlyCreated){
if(err){
    console.log("SOMETHING WENT WRONG")
} else{
     // redirect back to products route.
    res.redirect("/products");
}
});



});

// NEW - SHOW FORM TO CREATE PRODUCTS
app.get("/products/new",isLoggedIn,function(req,res){
    res.render("products/new.ejs");
});


// SHOW MORE INFO ABOUT PRODUCTS
app.get("/products/:id", function(req,res){
    // Find the Product with provided ID
    Product.findById(req.params.id).populate("comments").exec(function(err,foundProduct){
       if(err) {
           console.log("error")
       } else {
           console.log("foundProduct");
         // render show template with that product
         res.render("products/show", {product:foundProduct});
       }
    });

});


// ================================
// COMMENTS ROUTES
// ================================

app.get("/products/:id/comments/new", isLoggedIn ,function(req,res){
//  find product by id
Product.findById(req.params.id, function(err,product){
    if(err){
        console.log(err);
    } else{
        res.render("comments/new", {product:product});
    }
});
 
  
});


app.post("/products/:id/comments",isLoggedIn,function(req,res){
        //  lookup product using id
            Product.findById(req.params.id, function(err,product){
                if(err){
                    console.log(err);
                    res.redirect("/products");
                 }else{
                     Comment.create(req.body.comment,function(err,comment){
                         if(err){
                             console.log(err)
                         }else{
                             product.comments.push(comment);
                             product.save();
                             res.redirect('/products/' + product._id);
                         }
                     });
                
                
                }
            });
    
         // create new comment
        // connect new comment to product
        //  redirect product to show page


});

// ==================
// AUTH ROUTES
// ==================

// show the register/signup form

app.get("/register", function(req,res){
        res.render("register");
});

// handle sign up logic
app.post("/register", function(req,res){
   var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
            if(err){
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req,res, function(){
                    res.redirect("/products");
            });
    
    });

});

// =============
// SHOW LOGIN FORM
// =============
app.get("/login", function(req,res){
    res.render("login");
});

// =============
// Handlng Login data
// =============
// app.post("/login", ,middleware, callback)
app.post("/login",passport.authenticate("local",
{successRedirect:"/products",
failureRedirect: "/login",
}) ,function(req,res){
    
});

// ==========
    // logic route
// ==========
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}






app.listen("3000",function(req,res){
    console.log("SERVER STARTED.");
});