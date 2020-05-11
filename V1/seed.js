var mongoose = require("mongoose");
var Product  = require("./models/products");
var Comment  = require("./models/comment");

var data = [
    {name: "Beach", 
    image:"https://r-cf.bstatic.com/images/hotel/max1024x768/222/222636340.jpg",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, delectus! Enim iusto sapiente maxime, minima dolor accusamus repudiandae maiores, quisquam placeat, aut magnam asperiores eveniet. Quasi doloremque eos recusandae exercitationem."

    },


    {name: "Coconut water", 
    image:"https://media-cdn.tripadvisor.com/media/photo-s/05/39/84/00/stlucia-best-experience.jpg",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, delectus! Enim iusto sapiente maxime, minima dolor accusamus repudiandae maiores, quisquam placeat, aut magnam asperiores eveniet. Quasi doloremque eos recusandae exercitationem."
    },

    {name: "Bounty Rum", 
    image:"https://mma.prnewswire.com/media/662441/Bounty_Rum.jpg?p=publish",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, delectus! Enim iusto sapiente maxime, minima dolor accusamus repudiandae maiores, quisquam placeat, aut magnam asperiores eveniet. Quasi doloremque eos recusandae exercitationem."

},


    

]




function seedDB(){
    // remove products
    Product.deleteMany({}, function(err){
        if(err){
            console.log(err);
        } else{
            console.log("removed campgrounds!");
            // add a few campgrounds
            data.forEach(function(seed){
                Product.create(seed, function(err,product){
                if(err){
                    console.log(err);
                } else{
                    console.log("Added a campground");
                    // create a comment
                    Comment.create(
                        {
                            text:"This place is great",
                            author:"Homer",
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                             product.comments.push(comment);
                              product.save();  
                              console.log("Comment created")
                            }
                                                          
                        });
                }
                
                    });
                });
                
        }
        
        
    });
    // add a few products

}

module.exports = seedDB;


