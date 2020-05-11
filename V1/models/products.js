var mongoose = require("mongoose");

// SCHEMA SETUP.
var productSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

//  Now compile above info into model.
var Product = mongoose.model("Product",productSchema);
module.exports = Product;